#### profilers
```python
import resource
import gc

from celery import Celery

app = Celery()
app.conf.update(BROKER_URL='redis://localhost:6379/1')

@app.task
def dummy():
    return '1'


def print_mem():
    print 'Memory usage: %s (kb)' % resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

def run():
    for i in range(10000):
        dummy.delay()
        if i % 1000 == 0:
            print_mem()

run()
print gc.garbag
```
## code usecase project, that worth to see
#### python
+ [mock_django/query][1]
+ [hipochat/chat.py at master · Hipo/hipochat][2]
+ [KeepSafe][3]

[1]: https://github.com/dcramer/mock-django/blob/master/mock_django/query.py
[2]: https://github.com/Hipo/hipochat/blob/master/hipochat/chat.py
[3]: https://github.com/KeepSafe/aiohttp/blob/v0.22.5/examples/wssrv.py
