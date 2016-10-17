import win32com.adsi

# by path
DNC=win32com.adsi.ADsGetObject('LDAP://rootDSE').Get('DefaultNamingContext')
path = 'LDAP://cn=BIG_GROUP,ou=Groups,'+DNC
groupobj = win32com.adsi.ADsGetObject(path)
users = groupobj.member
print len(users)

# by sid
$strSID="S-1-5-21-500000003-1000000000-1000000003-1001"
$uSid = [ADSI]"LDAP://<SID=$strSID>"
echo $uSid
