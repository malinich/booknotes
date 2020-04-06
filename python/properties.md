```python
class ReadOnlyCachedAttribute(object):
    def __init__(self, method, name=None):
        self.method = method
        self.name = name or method.__name__
        self.__doc__ = method.__doc__

    def __get__(self, inst, cls):
        if inst is None:
            return self
        elif self.name in inst.__dict__:
            return inst.__dict__[self.name]
        else:
            result = self.method(inst)
            inst.__dict__[self.name] = result
            return result

    def __set__(self, inst, value):
        raise AttributeError("This property is read-only")

    def __delete__(self, inst):
        del inst.__dict__[self.name]

if __name__=='__main__':
    class Foo(object):
        @ReadOnlyCachedAttribute
        # @read_only_lazyprop
        def bar(self):
            print 'Calculating self.bar'  
            return 42
    foo=Foo()
    print(foo.bar)
    # Calculating self.bar
    # 42
    print(foo.bar)    
    # 42
    try:
        foo.bar=1
    except AttributeError as err:
        print(err)
        # This property is read-only
    del(foo.bar)
    print(foo.bar)
    # Calculating self.bar
    # 42
    
```
