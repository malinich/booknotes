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
```
