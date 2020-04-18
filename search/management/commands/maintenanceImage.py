import os
import shutil
from django.core.management.base import BaseCommand
from download.models import Image


class Command(BaseCommand):
    help = '全てのImageをメンテナンス。'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        # ファイル名が無いドットファイルにファイル名を与える。(.jpg⇒_.jpg)
        for image in Image.objects.all():
            if os.path.basename(image.picture).startswith('.'):
                dir_name = os.path.dirname(image.picture) # blog_images/1_07/9244
                file_path = os.path.join(dir_name, '_' + os.path.basename(image.picture)) # blog_images/1_07/9244/_.jpg

                full_dir_name = os.path.dirname(image.picture.path) # /www/var/otapick/media/blog_images/1_07/9244
                full_file_path = os.path.join(full_dir_name, '_' + os.path.basename(image.picture)) # /www/var/otapick/media/blog_images/1_07/9244/_.jpg

                shutil.move(image.picture.path, full_file_path)
                image.picture = file_path
                image.save()
                print(str(image.publisher.title) + '/' + str(image.order), 'done!!')
