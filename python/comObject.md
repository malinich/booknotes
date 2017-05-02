> release Com

```python
# pip install comtypes

from comtypes.automation import IDispatch
from ctypes import c_void_p, cast, POINTER, byref

def release_reference(self, obj):
    logger.debug("release com object")
    oleobj = obj._oleobj_
    addr = int(repr(oleobj).split()[-1][2:-1], 16)

    pointer = POINTER(IDispatch)()
    cast(byref(pointer), POINTER(c_void_p))[0] = addr
    pointer.Release()
```
> release Com (no shure)

```python
import weakref
from win32com.client import CLSIDToClass
from win32com.client.gencache import EnsureModule, GetModuleForCLSID
from win32com.client import gencache
import pythoncom

def process_data(mtb_ref, data):
    try:
        mtb_ref().do_something(data)
    finally:
        mtb_ref().Quit()

def main(mtb_ref):
    data = get_data()
    process_data(mtb_ref, data)

if __name__ == '__main__':
    pythoncom.CoInitialize()
    mtb_ref = weakref.ref(gencache.EnsureDispatch('Mtb.Application'))
    main(mtb_ref)
    pythoncom.CoUninitialize()
    
# i use only gencache.EnsureDispatch('Mtb.Application')
# it help to see methods
```

> Memory Leak in Threaded COM Object with Python
```python
from win32process import SetProcessWorkingSetSize
from win32api import GetCurrentProcessId, OpenProcess
from win32con import PROCESS_ALL_ACCESS

import win32com.client
import threading
import pythoncom

def CreateTom():
    pythoncom.CoInitialize()
    tom = win32com.client.Dispatch("TOM.Document")
    tom.Dataset.Load("FileName")
    tom.Clear()
    pythoncom.CoUninitialize()
    SetProcessWorkingSetSize(handle,-1,-1) #Releases memory after every use

pid = GetCurrentProcessId()
handle = OpenProcess(PROCESS_ALL_ACCESS, True, pid)

for i in range(50):
    t = threading.Thread(target = CreateTom)
    t.daemon = False
    t.start()
```
