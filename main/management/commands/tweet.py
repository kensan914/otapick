from django.core.management.base import BaseCommand
from otapick.twitter.implements import UpdateBot


class Command(BaseCommand):
    help = 'tweet update information.'

    def add_arguments(self, parser):
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2). default:None')

    def handle(self, *args, **options):
        UpdateBot().tweet(group_id=1, blog_ct=31739)