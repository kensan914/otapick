import os
import shutil
from django.core.management.base import BaseCommand
import otapick
from image.models import Image


class Command(BaseCommand):
    help = '全てのImageをメンテナンス。↓メンテナンス内容' \
           '1. ファイル名が無いドットファイルにファイル名を与える。(.jpg⇒_.jpg)' \
           '2. gifファイルを排除'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        for image in Image.objects.all():
            # ファイル名が無いドットファイルにファイル名を与える。(.jpg⇒_.jpg)
            if os.path.basename(str(image.picture)).startswith('.'):
                dir_name = os.path.dirname(str(image.picture)) # blog_images/1_07/9244
                file_path = os.path.join(dir_name, '_' + os.path.basename(str(image.picture))) # blog_images/1_07/9244/_.jpg

                full_dir_name = os.path.dirname(str(image.picture.path)) # /www/var/otapick/media/blog_images/1_07/9244
                full_file_path = os.path.join(full_dir_name, '_' + os.path.basename(str(image.picture))) # /www/var/otapick/media/blog_images/1_07/9244/_.jpg

                shutil.move(image.picture.path, full_file_path)
                image.picture = file_path
                image.save()
                print(str(image.publisher.title) + '/' + str(image.order), 'resolve .file!!')

            # gifファイルを排除
            if os.path.splitext(str(image.picture))[1] == '.gif':
                otapick.delete_image(image)
                print(str(image.publisher.title) + '/' + str(image.order), 'resole gif file!!')
