get info about user
```python
import win32com.adsi

# by path
DNC=win32com.adsi.ADsGetObject('LDAP://rootDSE').Get('DefaultNamingContext')
path = 'LDAP://cn=BIG_GROUP,ou=Groups,'+DNC
groupobj = win32com.adsi.ADsGetObject(path)
users = groupobj.member
print len(users)

# by sid
def sid_display_name(sid, display_name):
    if is_sid(sid):
        path_ldap = 'LDAP://<SID={}>'.format(sid)
        userobj = win32com.adsi.ADsGetObject(path_ldap)
        display_name = userobj.displayname
    return display_name
```

run as

```python
def _logon(self):
    print "> ", win32api.GetUserName()
    privs = [
        u'SeSecurityPrivilege',
        u'SeBackupPrivilege',
        u'SeRestorePrivilege',
        u'SeTakeOwnershipPrivilege',
        u'SeDebugPrivilege',
        u'SeSystemEnvironmentPrivilege',
        u'SeLoadDriverPrivilege',
        u'SeImpersonatePrivilege',
    ]
    _authHandle = win32security.LogonUser(
        # u'admindv', u'SPORTACADEM', self.password,
        self.client_user.split('\\')[1] + 'qwe',
        self.client_user.split('\\')[0], self.client_password,
        win32con.LOGON32_LOGON_NEW_CREDENTIALS,
        win32con.LOGON32_PROVIDER_DEFAULT
    )
    for priv_name in privs:
        try:
            privilege = get_privilege(priv_name)
            win32security.AdjustTokenPrivileges(_authHandle, 0, privilege)
        except Exception as e:
            print "Cannot add %s privilege" % priv_name
    win32security.ImpersonateLoggedOnUser(_authHandle)
    print ">>", win32api.GetUserName()
    return _authHandle
    
def _logoff(self, _authHandle):
    win32security.RevertToSelf()
    _authHandle.Close()
    
def _doAuth(self, pkg_name):
    auth_info = self.client_user.split('\\')[1], \
                self.client_user.split('\\')[0], self.client_password
    sspiclient = sspi.ClientAuth(pkg_name, auth_info=auth_info,
                                 targetspn='dv-demo-01@sportacadem.ru')  # win32api.GetUserName())
    sspiserver = sspi.ServerAuth(pkg_name)

    sec_buffer = None
    err = 1
    while err != 0:
        err, sec_buffer = sspiclient.authorize(sec_buffer)
        err, sec_buffer = sspiserver.authorize(sec_buffer)
    return sspiclient, sspiserver

def _impersonate(self, pkg_name):
    print "> ", win32api.GetUserName()
    # Just for the sake of code exercising!
    sspiclient, sspiserver = self._doAuth(pkg_name)
    sspiserver.ctxt.ImpersonateSecurityContext()
    print ">>", win32api.GetUserName()
    return sspiserver
    
def _revert_to_self(self, sspiserver):
    sspiserver.ctxt.RevertSecurityContext()

def _impersonateNTLM(self):
    return self._impersonate("NTLM")
```

create COM connection
```python
def get_privilege(privilege_name):
    privilege = None
    try:
        # SE_SECURITY_NAME, SE_CHANGE_NOTIFY_NAME, SE_TCB_NAME, SE_ASSIGNPRIMARYTOKEN_NAME
        privilege_luid = win32security.LookupPrivilegeValue(None, privilege_name)
        privilege = [(privilege_luid, win32security.SE_PRIVILEGE_ENABLED)]
    except Exception as e:
        print e
    return privilege

def connect(self, retry=None):
    """
    See http://eduunix.ccut.edu.cn/index2/html/python/
    OReilly%20-%20Python%20Programming%20on%20Win32/pythonwin32_snode191.html
    """

    def get_from_pool(name):
        conn = None
        with Lock():
            connection_stream = ConnectionPool.get_connection(name)
            if connection_stream:
                conn = self.threading.unmarshal(connection_stream)
                put_to_pool(name, conn)
        return conn

    def put_to_pool(name, conn):
        connection_stream = self.threading.marshal(conn)
        ConnectionPool.add_connection(name, connection_stream)

        try:
            if not self._session:
                # ====================================
                # _authHandle = win32security.LogonUser(
                # self.user_name, self.domain_name, self.password,
                # win32con.LOGON32_LOGON_NEW_CREDENTIALS,
                # win32con.LOGON32_PROVIDER_DEFAULT
                # )
                # privilege = get_privilege(win32security.SE_SECURITY_NAME)
                # win32security.AdjustTokenPrivileges(_authHandle, 0, privilege)
                # privilege = get_privilege(win32security.SE_CHANGE_NOTIFY_NAME)
                # win32security.AdjustTokenPrivileges(_authHandle, 0, privilege)
                # privilege = get_privilege(win32security.SE_TCB_NAME)
                # win32security.AdjustTokenPrivileges(_authHandle, 0, privilege)
                # privilege = get_privilege(win32security.SE_ASSIGNPRIMARYTOKEN_NAME)
                # win32security.AdjustTokenPrivileges(_authHandle, 0, privilege)
                # win32security.ImpersonateLoggedOnUser(_authHandle)
                # ====================================
                with self._lock:  # only one thread can establish connection at same time, others will get it from pool
                    self.threading.init_com()

                    _session = get_from_pool(self.client.host)
                    if not _session:
                        logger.debug("Connecting to DocsVision server...")
                        try:
                            pythoncom.CoInitializeSecurity(
                                None,  # sd
                                None,  # authSvc
                                None,  # reserved1
                                pythoncom.RPC_C_AUTHN_LEVEL_CONNECT,  # authnLevel
                                pythoncom.RPC_C_IMP_LEVEL_IDENTIFY,  # impLevel
                                None,  # authInfo
                                pythoncom.EOAC_NONE,  # capabilities
                                None  # reserved2
                            )
                        except Exception as e:
                            pass
                        _clsctx = pythoncom.CLSCTX_INPROC_SERVER | pythoncom.CLSCTX_LOCAL_SERVER

                        self._session_manager = win32com.client.Dispatch(
                            self.client.com_name, clsctx=_clsctx)
                        self._session_manager.ConnectAuth(self._connect_address,
                                                          self.client.db_name,
                                                          self.client.dv_user,
                                                          self.client.dv_password)
                        _session = self._session_manager.CreateSession()
                        logger.debug("Connection to DocsVision server established.")
                        put_to_pool(self.client.host, _session)

                    self._session = _session
                    return self.session

        except Exception as e:
            logger.debug("Connection failed.")
            self.disconnect()
            ConnectionPool.remove_connection(self.client.host)
            if retry:
                logger.debug("Trying to reconnect...")
                retry -= 1
                self.connect(retry=retry)
            else:
                raise

def disconnect(self):
    try:
        with self._lock:
            self.session.Logout()
            ConnectionPool.remove_connection(self.client.host)
            self._session = None
    except Exception as e:
        pass
