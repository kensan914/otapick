from django.core.management.base import BaseCommand
from download.models import Image
from search.models import Blog
from search.scripts.blogRegister import support


class Command(BaseCommand):
    help = 'blogのscoreを計算し、上書き。' \
           '3時間ごとに実行。'

    def handle(self, *args, **options):
        try:
            blogs = Blog.objects.exclude(num_of_views=0)
            for blog in blogs:
                max_d1_per_week = Image.objects.filter(publisher=blog).order_by('-d1_per_week')[0].d1_per_week
                score = blog.v1_per_week * 3 + blog.v2_per_week * 2 + blog.v3_per_week + max_d1_per_week * 3
                blog.score = score
                blog.save()

        except Exception as e:
            support.print_console(e)
        else:
            support.print_console('finished calc_blog_score!!')
