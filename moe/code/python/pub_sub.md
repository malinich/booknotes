```python
# coding: utf-8
from __future__ import unicode_literals

import logging
import os
import thread
import threading

import mock
import redis
from concurrent.futures import ThreadPoolExecutor

from .connector import Connector
from ..error import MsSQLException
from ..models import MsSQLServerConfig
from ..services.service import service_pool
from ..utils import catch_error

logger = logging.getLogger(__name__)


class Listener(threading.Thread):
    def __init__(self, observer, r, channels):
        super(Listener, self).__init__()
        self.observer = observer
        self.redis = r
        self.pubsub = self.redis.pubsub()
        self.pubsub.subscribe(channels)

    def work(self, item):
        print item['channel'], ":", item['data']

    def run(self):
        for item in self.pubsub.listen():
            print "{}:{}-{}".format('Listener', os.getpid(), thread.get_ident())

            if item['data'] == "KILL":
                self.pubsub.unsubscribe()
                print self, "unsubscribed and finished"
                break
            if isinstance(item['data'], str) and "DONE::" in item['data']:
                server_id = item['data'].split("::")[-1]
                server = MsSQLServerConfig.objects.get(pk=server_id)
                subscribe = Subscribe(server)
                self.append(subscribe)

            else:
                self.work(item)

    def append(self, observer):
        self.observer.attach(observer)


class Singleton(type):
    def __init__(cls, name, bases, dicts):
        super(Singleton, cls).__init__(name, bases, dicts)
        cls.instance = None

    def __call__(cls, subscribe_on, *args):
        if cls.instance is None:
            cls.instance = super(Singleton, cls).__call__(subscribe_on, *args)
        return cls.instance


class Observer(object):
    __metaclass__ = Singleton
    channel = 'GrantEventNotification'

    def __init__(self, subscribe_on, ):
        self.subscribe_on = subscribe_on
        self._subscribers = [mock.MagicMock(f=mock.MagicMock(running=mock.MagicMock(return_value=['mock',False])))]
        self.r = redis.Redis()
        self.client = Listener(self, self.r, [Observer.channel])
        self.client.start()
        print "{}:{}-{}".format('INIT', os.getpid(), thread.get_ident())

    def find(self):
        return id(self)

    def attach(self, observer):
        """

        :param observer:
        :type observer: DiffApp.clients.mssqlClient.client.subscription.Subscribe
        :return:
        :rtype:
        """
        print 'attach', self.find()
        print "{}:{}-{}".format('Observer', os.getpid(), thread.get_ident())

        self._subscribers.append(observer)
        logger.debug('attach:{}'.format(observer.server_name))

        observer.set_done(self.done, observer)
        observer.subscribe()
        print 'subscribed'

    def done(self, subscriber):
        result, server = subscriber.get_result()
        print "{}:{}-{}".format('Observer done', os.getpid(), thread.get_ident())

        self.subscribe_on(result, server)
        self._subscribers.remove(subscriber)
        self.r.publish(Observer.channel, 'DONE::{}'.format(server.id))

    def is_alive(self):
        for s in self._subscribers:
            print s.f.running()


class Subscribe(object):
    _concurrency = 5
    _done = lambda *args: None

    def __init__(self, server):
        self._callback = lambda: None
        self._result = None
        self.pool = None
        self.f = None
        self.default_db = 'msdb'
        self.server = server
        self.server_name = server.name
        self.connector = Connector(server.host, server.port)

        self.initialize_notify()

    @catch_error(Exception, MsSQLException, None, logger=logger)
    def notify_wait(self):
        sql = ["""WAITFOR (RECEIVE * FROM GrantEventNotificationQueue )"""]
        results = self.connector.execute(self.default_db, sql, "Notify")
        return results, self.server

    def notify_create(self):
        sqls = ["""SELECT * FROM sys.service_queues WHERE "name" = 'GrantEventNotificationQueue'"""]
        results = self.connector.execute(self.default_db, sqls, "QUEUE")

        if len(results) == 0:
            sqls = [
                """CREATE QUEUE GrantEventNotificationQueue;""",

                """CREATE SERVICE [GrantEventNotificationService]
                ON QUEUE GrantEventNotificationQueue
                ([http://schemas.microsoft.com/SQL/Notifications/PostEventNotification]);""",

                """CREATE EVENT NOTIFICATION PermissionEvents_SERVER_SECURITY_EVENTS
                ON SERVER FOR DDL_SERVER_SECURITY_EVENTS
                TO SERVICE 'GrantEventNotificationService', 'current database';""",

                """CREATE EVENT NOTIFICATION PermissionEvents_DATABASE_SECURITY_EVENTS
                ON SERVER FOR DDL_DATABASE_SECURITY_EVENTS
                TO SERVICE 'GrantEventNotificationService', 'current database';"""
            ]
            self.connector.execute(self.default_db, sqls, None)
        return None

    def notify_clean(self):
        sqls = [
            """DROP EVENT NOTIFICATION PermissionEvents_SERVER_SECURITY_EVENTS ON Server;""",
            """DROP EVENT NOTIFICATION PermissionEvents_DATABASE_SECURITY_EVENTS ON Server;""",
            """DROP SERVICE [GrantEventNotificationService];""",
            """DROP QUEUE GrantEventNotificationQueue;"""
        ]
        self.connector.execute(self.default_db, sqls, None)
        return None

    def subscribe(self):
        """
        :type server: DiffApp.clients.mssqlClient.models.MsSQLServerConfig
        """
        print "{}:{}-{}".format('Subscribe', os.getpid(), thread.get_ident())

        logger.debug('create subscribe mssql event of {}'.format(self.server_name))
        self.pool = ThreadPoolExecutor(max_workers=1)

        self.f = self.pool.submit(self.notify_wait)
        self.f.server_name = self.server_name

        self.f.add_done_callback(self.notify_done)
        self.f.add_done_callback(self.done)

    def done(self, future):
        if future.cancelled():
            logger.debug('{}: task cancelled'.format(future.server_name))
        elif future.done():
            error = future.exception()
            if error:
                logger.error("{}: error".format(future.server_name))

        return self._done()

    def notify_done(self, future):
        """

        :param future:
        :type future: concurrent.futures._base.Future
        :return:
        :rtype:
        """
        if future.cancelled():
            logger.debug('{}: task cancelled'.format(future.server_name))
        elif future.done():
            error = future.exception()
            if error:
                logger.error("{}: error".format(future.server_name))
            else:
                result, server = future.result()
                self.set_result(result)

    def set_done(self, func, *args):
        self._done = lambda: func(*args)

    def reset_server(self):
        self.notify_clean()  # be careful. else you lost permissions

    def set_result(self, result):
        self._result = result

    def get_result(self):
        return self._result, self.server

    def initialize_notify(self):
        try:
            self.notify_create()
        except Exception as e:
            logging.error(':'.join([','.join(e.args), e.message]))


class SubscriptionService(object):
    client_type = 'mssql'

    def __init__(self):
        service = service_pool.get_service(SubscriptionService.client_type)
        self.observer = Observer(subscribe_on=service.event_come)

    def subscribe_servers(self):
        observer = self.get_observer()

        for server in MsSQLServerConfig.objects.filter(enable_subscription=True):
            logger.info('subscribe to events of SQL Server for: {}'.format(server.host))
            s = Subscribe(server=server)
            observer.attach(s)

    def subscribe_server(self, server):
        observer = self.get_observer()
        s = Subscribe(server=server)
        observer.attach(s)

    def get_observer(self):
        return self.observer

    def is_alive(self):
        self.observer.is_alive()
```
