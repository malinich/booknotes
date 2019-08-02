
```python
# debug channels

def trace_on_abort():
    import signal
    import traceback

    def print_trace(sig, frame):
        print(''.join(traceback.format_stack(frame)))

    signal.signal(signal.SIGABRT, print_trace)


trace_on_abort()
```

========== profiling=====================
pip install gprof2dot
sudo apt-get install graphviz
 
gprof2dot -f pstats profile_for_func1_001 | dot -Tpng -o profile.png
 
def profileit(name):
    """
    @profileit("profile_for_func1_001")
    """
    def inner(func):
        def wrapper(*args, **kwargs):
            prof = cProfile.Profile()
            retval = prof.runcall(func, *args, **kwargs)
            # Note use of name from outer scope
            prof.dump_stats(name)
            return retval
        return wrapper
    return inner
 
