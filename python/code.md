> Singleton  

```python
class Singleton(type):
    def __init__(cls, name, bases, dict):
        super(Singleton, cls).__init__(name, bases, dict)
        cls.instance = None 

    def __call__(cls,*args,**kw):
        if cls.instance is None:
            cls.instance = super(Singleton, cls).__call__(*args, **kw)
        return cls.instance

class MyClass(object):
    __metaclass__ = Singleton
```

> Named tuple and optional keyword arguments

```python
>>>from collections import namedtuple
>>> Node = namedtuple('Node', 'val left right')
>>> Node.__new__.__defaults__ = (None,) * len(Node._fields)
>>> Node()
Node(val=None, left=None, right=None)
```

> Thread wrapper

```python
class ThreadPoolExecutorStackTraced(ThreadPoolExecutor):
    def submit(self, fn, *args, **kwargs):
        """Submits the wrapped function instead of `fn`"""

        return super(ThreadPoolExecutorStackTraced, self).submit(
            self._function_wrapper, fn, *args, **kwargs)

    def _function_wrapper(self, fn, *args, **kwargs):
        """Wraps `fn` in order to preserve the traceback of any kind of
        raised exception

        """
        try:
            return fn(*args, **kwargs)
        except Exception as e:
            logger.exception('notify error')
            print e
            raise sys.exc_info()[0](traceback.format_exc())
```

> Get object by ID

```python
import ctypes
a = "hello world"
print ctypes.cast(id(a), ctypes.py_object).value

# ver2
import gc

def objects_by_id(id_):
    for obj in gc.get_objects():
        if id(obj) == id_:
            return obj
    raise Exception("No found")
```

> get traceback from ext object

```python
import sys, traceback
try:
    raise Exception
except Exception:
    ex_type, ex, tb = sys.exc_info()
    traceback.print_tb(tb)

```
