#### profilers
jmalloc
```bash

FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN groupadd -r app && useradd -r -g app app

RUN apt-get update
RUN apt-get install -y --no-install-recommends \
build-essential gcc libpq-dev libc-dev libmagic1 libpq5
RUN apt-get install libjemalloc2 && rm -rf /var/lib/apt/lists/*

ENV LD_PRELOAD /usr/lib/x86_64-linux-gnu/libjemalloc.so.2

WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade Cython && pip install -r requirements.txt

COPY . .
RUN chown -R app:app /app
USER app

CMD ["/bin/bash", "./entrypoint.sh"]

```
```python
 hp.heap().get_rp()
(Pdb) heap = hp.heap()
(Pdb) heap[0]

```
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
