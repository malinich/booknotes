#### coroutine

```python
def coroutine(func):
    def wrap(*args, **kwargs):
        obj = func(*args, **kwargs)
        next(obj)
        return obj

    return wrap


@coroutine
def caller(func):
    while True:
        x = (yield)
        func(x)


@coroutine
def collector(init, func, result):
    res = func(init)

    while True:
        try:
            x = (yield)
            res = func(x)
        except GeneratorExit:
            result(res)
            raise StopIteration()


@coroutine
def filter_(pred, func):
    while True:
        x = (yield)
        if pred(x):
            func.send(x)


@coroutine
def map_(func, target):
    while True:
        x = (yield)
        res = func(x)
        target.send(res)


@coroutine
def reducer_(fn, initial, target):
    res = initial
    while True:
        try:
            x = (yield)
            res = fn(res, x)
        except GeneratorExit:
            target.send(res)
            raise StopIteration()


def source(iterable, func):
    for i in iterable:
        func.send(i)


@coroutine
def source_gn(func):
    while True:
        x = (yield)
        for i in x:
            func.send(i)


def chain(*steps):
    steps = steps[::-1]
    arg = steps[0]
    if callable(arg):
        arg = arg()
    for s in steps[1:]:
        if callable(s):
            arg = s(arg)
        else:
            arg = s[0](*(tuple(s[1:]) + (arg,)))
    return arg
```
> use

```python
perms = []
split_perms = self._perms_splitter(raw_perms)
        
source(split_perms,
    chain(
        (filter_, lambda f: f[0] == key),  # filter by type
        (map_, lambda f: f[1]),  # f[1] is now is TableParam instance
        source_gn,
        (filter_, lambda t_p: (t_p.type_name == name) if t_p.type_name else True),
        (filter_, lambda t_p: t_p.grantor == grantor),
        caller(perms.append)))
 
```

#### utils

```python
def handle_error_func(func):
    @functools.wraps(func)
    def wrap(*args, **kwargs):
        try:
            res, error = func(*args, **kwargs), None
        except Exception as e:
            res, error = None, str(e) or e.__class__.__name__
        return res, error

    return wrap


def error_chain(*steps):
    funcs = steps[::-1]

    def wrap(*args, **kwargs):
        res, error = funcs[0](*args, **kwargs)
        if error:
            return res, error

        for func in funcs[1:]:
            res, error = func(res)
            if error:
                res = None
                break
        return res, error
    return wrap
```
> use

```python
sid, error = error_chain(
    handle_error_func(convert_to_sid),
    handle_error_func(binary_sid)
    )(hexlify(user.sid)[2:])
sid = hexlify(user.sid) if error else sid
```

> get_item
```python
def get_item(data, *keys):
    res, error = data, None
    key, keys = keys[:1], keys[1:]
    if key:
        res, error = error_chain(handle_error_func(operator.methodcaller("__getitem__", key[0])))(data)
        if not error:
            return get_item(res, *keys)
    return res, error

# use
data, _ = get_item({"data": "path": [0]}, 'data', 'results', 0)

def get_attrs(data, keys):
    func = operator.attrgetter(keys)
    res, error = error_chain(
            handle_error_func(func)
    )(data)
    return res, error

# use
get_attrs(user, 'organization.agency.accreditation_ids')
```

#### need think to complete

```python
def extract_users_roles_wrapper(func):
    num = 2
    count = [num]
    func_store = [None]

    def wrap(self):
        f_mock = func_store[0]
        if not f_mock:
            f_mock = itertools.tee(func(self), num)
            func_store[0] = f_mock
        if count[0]:
            count[0] -= 1
            return f_mock[count[0]]
        else:
            count[0] = num
            func_store[0] = None
            return wrap(self)

    return wrap
```

```python
class handle_error_attr:
    """
    used for chain attributes without catch error
    for exp. result, error = (handle_error_attr(obj) >> attr1 >> attr2 >> attr3).expand()
    without it need
    result = getattr(obj, attr1, None)
    result = getattr(result, "attr2", None)
    result = getattr(result, "attr3", None)

    """
    def __init__(self, obj: Any):
        self.obj = obj
        self.error = None

    def __rshift__(self, getattr_name: str):
        try:
            val = getattr(self.obj, getattr_name)
            return self.__class__(val)
        except Exception as e:
            self.error = str(e)
            return self

    def expand(self) -> Tuple[Optional[object], Optional[str]]:
        return self.obj, self.error

# use
email, error_email = (handle_error_attr(incident) >> "petition" >> "main_petitioner" >> "email").expand()
```
