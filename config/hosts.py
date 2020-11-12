from . import settings
from django_hosts import patterns, host
from admin import admin_urls


host_patterns = patterns(
    '',
    host(r'', settings.ROOT_URLCONF, name=''),
    host(r'admin', admin_urls, name='admin'),
    host(r'www', settings.ROOT_URLCONF, name='www'),
)
