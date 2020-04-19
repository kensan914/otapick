from django.core.management.base import BaseCommand
from main.scripts.initDB.groupListRegister import initGroup
from main.scripts.initDB.memberListRegister import initMember


class Command(BaseCommand):
    help = 'Initialize database.'

    def handle(self, *args, **options):
        initGroup()
        initMember()
