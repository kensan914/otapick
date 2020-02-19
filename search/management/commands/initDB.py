from django.core.management.base import BaseCommand
from search.scripts.initDB.groupListRegister import initGroup
from search.scripts.initDB.memberListRegister import initMember


class Command(BaseCommand):
    help = 'Initialize database.'

    def handle(self, *args, **options):
        initGroup()
        initMember()
