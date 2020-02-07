import os
from celery import Celery

# celeryで使うDjangoの設定ファイル(settings.py)を指定
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')
app = Celery('otapick')

# Djangoのconfigファイルをceleryのconfigとして使う宣言、celery用のconfigファイルを作ってもいい。
app.config_from_object('django.conf:settings')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(settings.INSTALLED_APPS)
