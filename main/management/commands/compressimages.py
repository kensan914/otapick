from django.core.management.base import BaseCommand
import otapick
from image.models import Image
from django.db.models import Q
from tqdm import tqdm



class Command(BaseCommand):
    help = 'picture_250x・picture_500xのいずれかが未設定の全ての画像を圧縮'


    def handle(self, *args, **options):
        add_images = []

        images = Image.objects.filter(Q(picture_250x=None) | Q(picture_500x=None))
        bar = tqdm(total = images.count())

        for image in images:
            image = otapick.compress_blog_image(image, is_bulk=True)
            add_images.append(image)
            bar.update(1)

        if len(add_images) > 100:
            Image.objects.bulk_update(add_images, fields=['picture_250x', 'picture_500x'], batch_size=10000)
            add_images = []
