from django.core.management.base import BaseCommand
from download.models import Image
from search.models import Blog


class Command(BaseCommand):
    help = 'Blogのパラメータ、v1_per_week、v2_per_week、v3_per_weekを一つずつずらす。' \
           'v1_per_week、Imageのパラメータ、d1_per_weekはリセット。' \
           '1週間ごと(毎週月曜日00:00)に実行。'

    def handle(self, *args, **options):
        blogs = Blog.objects.exclude(v1_per_week=0, v2_per_week=0, v3_per_week=0)
        for blog in blogs:
            blog.v3_per_week = blog.v2_per_week
            blog.v2_per_week = blog.v1_per_week
            blog.v1_per_week = 0
            blog.save()

        images = Image.objects.exclude(d1_per_week=0)
        for image in images:
            image.d1_per_week = 0
            image.save()
