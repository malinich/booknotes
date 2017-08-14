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

> release v3

```python
import win32com.client
import pythoncom

pythoncom.CoInitialize()

excelApp = win32com.client.DispatchEx("Excel.Application")

myStream = pythoncom.CreateStreamOnHGlobal()    
pythoncom.CoMarshalInterface(myStream, 
                             pythoncom.IID_IDispatch, 
                             excelApp._oleobj_, 
                             pythoncom.MSHCTX_LOCAL, 
                             pythoncom.MSHLFLAGS_TABLESTRONG)    

excelApp = None

myStream.Seek(0,0)
myUnmarshaledInterface = pythoncom.CoUnmarshalInterface(myStream, pythoncom.IID_IDispatch)    
unmarshalledExcelApp = win32com.client.Dispatch(myUnmarshaledInterface)

# Do some stuff in Excel in order to prove that marshalling has worked. 
unmarshalledExcelApp.Visible = True
xlWbs = unmarshalledExcelApp.Workbooks
xlWb = xlWbs.Add()
xlWss = xlWb.Worksheets
xlWs = xlWss.Add()
xlRange = xlWs.Range("A1")
xlRange.Value = "AAA"
unmarshalledExcelApp.Quit()    

# Clear the stream now that we have finished
myStream.Seek(0,0)
pythoncom.CoReleaseMarshalData(myStream)

xlRange = None
xlWs = None
xlWss = None
xlWb = None
xlWbs = None
myUnmarshaledInterface = None
unmarshalledExcelApp = None
myStream = None

pythoncom.CoUninitialize()
```
