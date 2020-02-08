import os
from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')

app = Celery('otapick')

app.config_from_object('django.conf:settings')

app.autodiscover_tasks(settings.INSTALLED_APPS)
