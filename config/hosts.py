from . import settings
from django_hosts import patterns, host
from config import admin_urls

host_patterns = patterns(
    '',
    host(r'', settings.ROOT_URLCONF, name='default'),
    host(r'admin', admin_urls, name='admin'),
    # host(r'www', settings.ROOT_URLCONF, name='www'),
)
