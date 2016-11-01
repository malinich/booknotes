```python
from __future__ import unicode_literals

# sid="S-1-9-0-2534816399-1133156984-2917391785-2514697442"
#  3ZJ9-54ZB-39PF-PCY3-10G9-2K44
import sys
import clr

sys.path.append(r"C:\\Program Files (x86)\\Docsvision\\5.0\\Client")
clr.AddReference('DocsVision.Platform.WinForms')
clr.AddReference('DocsVision.Platform.ObjectManager')
clr.AddReference('DocsVision.Platform.CardHost')

clr.AddReference("System.Security.Principal")
clr.AddReference("DocsVision.Platform.Extensibility")
clr.AddReference("DocsVision.Platform")

from System import Array
from DocsVision.Platform.Security.AccessControl import IPickerExtension
from System.Security.Principal import SecurityIdentifier
from DocsVision.Platform.CardHost import ICardHost
from DocsVision.Platform.ObjectManager import SessionManager
from DocsVision.Platform import CardHost


class Pa(object):
    def _connect(self):
        client_user = "DEMO\\Igor.Malinov"
        client_password = "mal-vina"
        manager = SessionManager.CreateInstance()
        _connect_address = "http://VDV-LIVE.demo.oim/DocsVision/StorageServer/StorageServerService.asmx"
        manager.Connect(_connect_address, '', client_user, client_password)
        session = manager.CreateSession()
        host = CardHost.CardHost.CreateInstance(session)
        return host
    def convert(self, sid):
        host = self._connect()
        xx = ICardHost.ExtensionManager.__get__(host)
        pp = xx.PickerExtensions[0]
        commonNames = Array.CreateInstance(str, 10)
        objectClasses = Array.CreateInstance(str, 10)
        objectUPNs = Array.CreateInstance(str, 10)
        qs=Array.CreateInstance(SecurityIdentifier, 1)
        qs[0] = SecurityIdentifier(sid)
        ls = IPickerExtension.LookupSids.__get__(pp)
        ls(qs, commonNames, objectClasses, objectUPNs)
        return commonNames, objectClasses, objectUPNs
```
