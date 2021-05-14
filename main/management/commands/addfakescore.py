from django.core.management.base import BaseCommand
from datetime import datetime
from django.utils import timezone
import random

from image.models import Image
from main.models import Blog
import otapick


class Command(BaseCommand):
    help = 'DBのデータに欠損が起きscoreがリセットされてしまった場合、偽スコアを加算する。(最終手段)'

    def add_arguments(self, parser):
        parser.add_argument('-d', '--date', type=str, help='この日付から最新のブログ・画像が対象となる. ex) 2021/05/15')

    def handle(self, *args, **options):
        threshold = 10 # 10より小さいときのみ更新
        blog_num_of_views_range = (10, 50)
        image_num_of_views_range = (10, 50)
        image_num_of_downloads_range = (10, 30)

        if not options['date']:
            otapick.print_console('date option is required.')
            return

        try:
            fromDate = datetime.strptime(options['date'], '%Y/%m/%d')
        except:
            otapick.print_console('date format is wrong.')
            return
        
        today = timezone.now()

        blogs = Blog.objects.filter(post_date__range=(fromDate, today))
        images = Image.objects.filter(publisher__post_date__range=(fromDate, today))

        for blog in blogs:
            if not blog.num_of_views > threshold:
                # num_of_views
                fake_blog_num_of_views = random.randint(*blog_num_of_views_range)
                otapick.increment_num_of_views(blog=blog, num=fake_blog_num_of_views)
            
            otapick.print_console(f'add fake score「{blog.title}」!!')

        for image in images:
            if not image.num_of_views > threshold:
                # num_of_views
                fake_image_num_of_views = random.randint(*image_num_of_views_range)
                otapick.increment_num_of_views(image=image, num=fake_image_num_of_views)

            if not image.num_of_downloads > threshold:
                # num_of_downloads
                fake_image_num_of_downloads = random.randint(*image_num_of_downloads_range)
                otapick.increment_num_of_downloads(image, image.publisher, num=fake_image_num_of_downloads)

            otapick.print_console(f'add fake score「{image.publisher}」({image.order}) !!')
