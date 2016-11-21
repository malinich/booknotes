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
            res, error = None, e.message or e.__class__.__name__
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
