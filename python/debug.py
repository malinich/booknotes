
# debug channels

def trace_on_abort():
    import signal
    import traceback

    def print_trace(sig, frame):
        print(''.join(traceback.format_stack(frame)))

    signal.signal(signal.SIGABRT, print_trace)


trace_on_abort()
