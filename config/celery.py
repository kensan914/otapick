import os
from celery import Celery, Task
from django.conf import settings
from django.db import transaction

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')

app = Celery('otapick')

app.config_from_object('django.conf:settings')

app.autodiscover_tasks(settings.INSTALLED_APPS)


class TransactionAwareTask(Task):
    """
    Task class which is aware of django db transactions and only executes tasks
    after transaction has been committed
    """
    abstract = True

    def apply_async(self, *args, **kwargs):
        """
        Unlike the default task in celery, this task does not return an async
        result
        """
        transaction.on_commit(
            lambda: super(TransactionAwareTask, self).apply_async(
                *args, **kwargs))
