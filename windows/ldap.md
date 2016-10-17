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
