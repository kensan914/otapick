import random
import numpy as np
from django.core.management.base import BaseCommand
from image.models import Image
from main.models import Blog
import otapick

class Command(BaseCommand):
    help = '開発用、フィールドをすべて書き換えるため、終わったらこれは削除。' \
           'ランダムに半分選んだblog, imageのパラメータ（ダウンロード数や閲覧数等）にランダム値を設定。'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        blogs = Blog.objects.all()
        images = Image.objects.all()

        id_list = list(blogs.values_list('id', flat=True))
        np.random.shuffle(id_list)
        selected_id_list = id_list[0: int(blogs.count()/30)]
        blogs = [blogs.get(id=pk) for pk in selected_id_list]

        id_list = list(images.values_list('id', flat=True))
        np.random.shuffle(id_list)
        selected_id_list = id_list[0: int(images.count()/30)]
        images = [images.get(id=pk) for pk in selected_id_list]

        for blog in blogs:
            otapick.increment_num_of_views(blog=blog, num=random.randrange(10))
            otapick.print_console(str(blog))

        for image in images:
            otapick.increment_num_of_views(blog=image, num=random.randrange(10))
            otapick.increment_num_of_downloads(image, image.publisher, num=random.randrange(10))
            otapick.edit_num_of_most_downloads(image.publisher)

            otapick.print_console(str(image))