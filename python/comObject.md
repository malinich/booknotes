> release Com

```python
from comtypes.automation import IDispatch
from ctypes import c_void_p, cast, POINTER, byref
from win32com.client import gencache

def release_reference(self, obj):
    logger.debug("release com object")
    oleobj = obj._oleobj_
    addr = int(repr(oleobj).split()[-1][2:-1], 16)

    pointer = POINTER(IDispatch)()
    cast(byref(pointer), POINTER(c_void_p))[0] = addr
    pointer.Release()
```
