#### sit to name
    
```python
def decode_sid(self, server, sid):
    """
    see SID types
    http://msdn.microsoft.com/en-us/library/ee202147(v=exchg.80).aspx
    """
    sid_obj = None
    try:  # try to get from domain
        sid_obj = win32security.LookupAccountSid(server, sid)
    except pywintypes.error, e:
        try:  # try to get from host
            sid_obj = win32security.LookupAccountSid(self.host, sid)
        except pywintypes.error, e2:
            pass
    if sid_obj:
        # FIXME Temporary solution
        domain = ntfs_client_settings.DOMAIN_MAP.get(sid_obj[1], sid_obj[1])
        if domain:
            user = u'%s\\%s' % (domain, sid_obj[0])  # FIXME: decode according to type
        else:
            user = sid_obj[0]
    else:
        user = u'Account unknown(%s)' % sid
    return user
 
def _get_name_by_sid(self, sid):
    if len(sid) < 8:
        return None
    sid_raw = convert_to_sid(str(sid))
    name = decode_sid(self.client.host, sid_raw) if sid_raw else None
    if name and name.startswith('Account unknown'):
        return None
    return name

def _get_display_name(self, sid, *args, **kwargs):
    name_with_domain = self._get_name_by_sid(sid)
    try:
        name_parts = name_with_domain.split('\\')
        name = name_parts[1] if len(name_parts) > 1 else name_parts[0]
        display_name = win32net.NetUserGetInfo(self._get_domain_controller(), name, 2).get('full_name')
        return display_name
    except Exception:
        return name_with_domain

def _get_domain_controller(self):
    try:
        return win32security.DsGetDcName(self.client.host)['DomainName']
    except:
        return None
            
 ```
