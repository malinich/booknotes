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
