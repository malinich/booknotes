> test by log

```python
class MockLoggingHandler(logging.Handler):
    """Mock logging handler to check for expected logs.

    Messages are available from an instance's ``messages`` dict, in order, indexed by
    a lowercase log level string (e.g., 'debug', 'info', etc.).
    """

    def __init__(self, *args, **kwargs):
        self.messages = {'debug': [], 'info': [], 'warning': [], 'error': [],
                         'critical': []}
        super(MockLoggingHandler, self).__init__(*args, **kwargs)

    def emit(self, record):
        "Store a message from ``record`` in the instance's ``messages`` dict."
        self.acquire()
        try:
            self.messages[record.levelname.lower()].append(record.getMessage())
        finally:
            self.release()

    def reset(self):
        self.acquire()
        try:
            for message_list in self.messages.values():
                del message_list
        finally:
            self.release()


class TestListener(APITestCase):
    @classmethod
    def setUpClass(cls):
        foo_log = logging.getLogger(subscription.__name__)
        cls._foo_log_handler = MockLoggingHandler(level='DEBUG')
        foo_log.addHandler(cls._foo_log_handler)
        cls.foo_log_messages = cls._foo_log_handler.messages
        super(TestListener, cls).setUpClass()

    def setUp(self):
        super(TestListener, self).setUp()
        self._foo_log_handler.reset()  # So each test is independent

    def test_run(self):
        s = mock.Mock()
        thread = threading.Thread(target=subscription.Listener, args=(s, "TEST_CHANNEL", "host-local-pop", 9999, 9999))

        thread.start()
        thread.join(10)
        exc = ctypes.py_object(SystemExit)
        ctypes.pythonapi.PyThreadState_SetAsyncExc(ctypes.c_long(thread.ident), exc)
        self.assertEqual(self.foo_log_messages['error'][0], 
                         "Error 11001 connecting to host-local-pop:9999. getaddrinfo failed.")
```
