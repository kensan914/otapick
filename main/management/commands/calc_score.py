import time
from django.core.management.base import BaseCommand
from image.models import Image
from main.models import Blog
import otapick

class Command(BaseCommand):
    help = 'blogのscoreを計算し、上書き。' \
           '3時間ごとに実行。' \
           'recommend_scoreにも対応。'

    def add_arguments(self, parser):
        parser.add_argument('-r', '--recommend', action='store_true')

    def handle(self, *args, **options):
        if options['recommend']:
            high_score_members, divided_blogs, divided_images  = otapick.init_calc_recommend_score()

            start = time.time()
            otapick.calc_recommend_score(high_score_members, divided_blogs=divided_blogs)
            otapick.print_console('finished calc_recommend_score blogs!!: {}s'.format(round(time.time() - start, 2)))

            start = time.time()
            otapick.calc_recommend_score(high_score_members, divided_images=divided_images)
            otapick.print_console('finished calc_recommend_score images!!: {}s'.format(round(time.time() - start, 2)))
        else:
            start = time.time()
            otapick.calc_score(blogs=Blog.objects.all())
            otapick.print_console('finished calc_score blogs!!: {}s'.format(round(time.time() - start, 2)))
            start = time.time()
            otapick.calc_score(images=Image.objects.all())
            otapick.print_console('finished calc_score images!!: {}s'.format(round(time.time() - start, 2)))
