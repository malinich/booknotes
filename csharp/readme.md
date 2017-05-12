```C#
// install all dependenies
Install-Package Costura.Fody
```


```xml
<!-- create FodyWeavers.xml -->
<?xml version="1.0" encoding="utf-8"?>
<Weavers>
  <Fielder />
  <PropertyChanged />
  <Costura DisableCompression='false' />
</Weavers>
```
```xml
<!-- packages.config -->
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="Costura.Fody" version="1.3.3.0" targetFramework="net45" developmentDependency="true" />
  <package id="Fielder.Fody" version="1.0.12" targetFramework="net45" developmentDependency="true" />
  <package id="Fody" version="1.29.4" targetFramework="net45" developmentDependency="true" />
  <package id="Microsoft.Build.Runtime" version="15.1.1012" targetFramework="net45" />
  <package id="PropertyChanged.Fody" version="1.52.1" targetFramework="net45" developmentDependency="true" />
  <package id="Microsoft.Sharepoint.2013.Client.16" version="1.0.0" targetFramework="net45" />
</packages>
```

_example com object_

```C#
using System;
using System.Security.Principal;
using System.Collections;
using System.Runtime.InteropServices;
using Platform.CardHost;
using Platform.ObjectManager;
using Platform.Extensibility;


namespace DVConverter
{

    [Guid("99A4976A-45C3-4BC5-BC0B-E474F4C39999")]
    [ComVisible(true)]
    public interface IConverter
    {
        [DispId(1)]
        void ConnectAuth(string user, string password, string url, string db);

        [DispId(2)]
        ArrayList Convert(string sid);

        [DispId(3)]
        void CloseSession();

        [DispId(4)]
        ArrayList Convert(string sid, UserSession session);
        
    }

    [Guid("998DC106-C57B-45C5-B4D7-29DF5C819999"),
    InterfaceType(ComInterfaceType.InterfaceIsIDispatch)]
    public interface ComClass1Events
    {

    }

    [Guid("0D53A3E8-E51A-49C7-944E-E72A20699999"),
    ClassInterface(ClassInterfaceType.None),
    ComSourceInterfaces(typeof(ComClass1Events))]
    [ProgId("DVConverter.Converter")]
    [ComVisible(true)]
    public class Converter : IConverter
    {
        protected UserSession session;

        public Converter()
        {

        }
        public ArrayList Convert(string sid, UserSession session)
        {

            UserSession s = (UserSession)session;
            ICardHost host = new CardHost(s);

            SecurityIdentifier[] sids = { new SecurityIdentifier(sid) };
            string[] accountNames = null;
            string[] commonNames = null;
            NavPickerAccountTypes[] accountTypes = null;

            int count = host.ExtensionManager.PickerExtensions.Count;

            if (count == 0)
            {
                throw new IdentityNotMappedException("picker not found");
            }
            INavPickerExtension picker = host.ExtensionManager.PickerExtensions[0];
            picker.LookupSids(sids, out accountNames, out commonNames, out accountTypes);

            ArrayList names = new ArrayList(2);
            names.Add(commonNames);
            names.Add(accountNames);
            return names;
        }
        
        public void ConnectAuth(string user, string password, string url, string db)
        {
            SessionManager manager = SessionManager.CreateInstance();
            manager.Connect(url, db, user, password);
            UserSession session = manager.CreateSession();
            this.session = session;
        }
        public ArrayList Convert(string sid)
        {

            if (session == null)
            {
                throw new IdentityNotMappedException("need login by user");
            }

            ICardHost host = new CardHost(session);

            SecurityIdentifier[] sids = { new SecurityIdentifier(sid) };
            string[] accountNames = null;
            string[] commonNames = null;
            NavPickerAccountTypes[] accountTypes = null;

            int count = host.ExtensionManager.PickerExtensions.Count;

            if (count == 0)
            {
                throw new IdentityNotMappedException("picker not found");
            }
            INavPickerExtension picker = host.ExtensionManager.PickerExtensions[0];
            picker.LookupSids(sids, out accountNames, out commonNames, out accountTypes);

            ArrayList names = new ArrayList(2);
            names.AddRange(commonNames);
            names.AddRange(accountNames);
            return names;
        }

        public void CloseSession()
        {
            if (session == null)
            {
                throw new IdentityNotMappedException("need login by user");
            }
            session.Close();
            session = null;
        }        
    }

}

```
_assembly of com object_
sn -k DVConverter.snk

```C#
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

[assembly: AssemblyTitle("DVConverter")]
[assembly: AssemblyDescription("")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("")]
[assembly: AssemblyProduct("DVConverter")]
[assembly: AssemblyCopyright("Copyright ©  2016")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]

[assembly: ComVisible(true)]
[assembly: Guid("99cdc87f-9305-4ad7-80af-b0b33d674999")]

[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]
[assembly: AssemblyKeyFile("DVConverter.snk")]
```
