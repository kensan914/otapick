from . import settings
from django_hosts import patterns, host
from config.urls import admin_urls

host_patterns = patterns(
    "",
    host(r"admin", admin_urls, name="admin"),
    host(r"", settings.ROOT_URLCONF, name="default"),
)
