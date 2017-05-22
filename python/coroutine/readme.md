> coroutine + thread
```python
from threading import Thread, current_thread
from random import randint
import time
from datetime import datetime
def collect(cor):
    sleep = randint(10,40)
    print("{}#{}#sleep:{}sec".format(datetime.now(),current_thread(),sleep))
    time.sleep(float(sleep))
    for i in range(3):
        cor.send(i)
class SomeCor():
    history = []
    def __call__(self,):
        while True:
            x = (yield)
            print("{}#{}:{}".format(datetime.now(),current_thread(),x))
            self.history.append(x)
threads = []
cor = SomeCor()
gen=cor()
gen.next()
for i in range(3):
    worker = Thread(target=collect, args=(gen,))
    threads.append(worker)
    worker.start()
print(cor.history)
```

> examples
```python
def coroutine(fn):
    """Декоратор, обеспечивающий запуск сопроцедуры при вызове"""
    def wrapper(*args, **kwargs):
        obj = fn(*args, **kwargs)
        obj.next()
        return obj
    return wrapper


def source(iterable, target):
    """Источник "скармливающий" данные из итератора в сопроцедуру-получатель"""
    for i in iterable:
        target.send(i)


@coroutine
def filter_(pred, target):
    """Сопроцедура-фильтр"""
    while True:
        x = (yield)
        if pred(x):
            target.send(x)

@coroutine
def map_(fn, target):
    """Сопроцедура - применятель"""
    while True:
        target.send(fn((yield)))

@coroutine
def broadcast(*targets):
    """Сопроцедура - разветвитель"""
    while True:
        x = (yield)
        for t in targets:
            t.send(x)

@coroutine
def printer(fmt="%s"):
    """Сток, выводящий данные в стандартный вывод"""
    while True:
        print fmt % ((yield))


@coroutine
def reducer(fn, initial, target):
    """Сопроцедура, производящая свертку данных"""
    res = initial
    while True:
        try:
            res = fn(res, (yield))
        except GeneratorExit:
            target.send(res)
            raise StopIteration()

@coroutine
def caller(fn):
    """Сток, вызывающий для каждого элемента данных указанную функцию"""
    while True:
        fn((yield))
```
