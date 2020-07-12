import time
from django.core.management.base import BaseCommand
import otapick.db.scores.controller
from image.models import Image
from main.models import Blog
import otapick


class Command(BaseCommand):
    help = 'Blogのパラメータ、v1_per_day、v2_per_day、v3_per_dayを一つずつずらす。' \
           'v1_per_day、Imageのパラメータ、d1_per_dayはリセット。' \
           '1日ごと(毎日00:00)に実行。'

    def add_arguments(self, parser):
        parser.add_argument('-r', '--reverse', action='store_true',
                            help='間違えて実行してしまったときに元に戻す。ただ、消えてしまったv3_per_day, d1_per_dayは修復不可。')

    def handle(self, *args, **options):
        if options['reverse']:
            otapick.shift_score(blogs=Blog.objects.all(), order=False)
            otapick.shift_score(images=Image.objects.all(), order=False)
        else:
            start = time.time()
            otapick.shift_score(blogs=Blog.objects.all(), order=True)
            otapick.print_console('finished shift_per_day blogs!!: {}s'.format(round(time.time() - start, 2)))
            start = time.time()
            otapick.shift_score(images=Image.objects.all(), order=True)
            otapick.print_console('finished shift_per_day images!!: {}s'.format(round(time.time() - start, 2)))
