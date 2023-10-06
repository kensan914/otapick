from django.core.management.base import BaseCommand
from api import otapick
from api.models.image.models import Image
from django.db.models import Q
from tqdm import tqdm


class Command(BaseCommand):
    help = "width・heightのいずれかが未設定の全ての画像にwidth・heightを設定"

    def handle(self, *args, **options):
        add_images = []

        images = Image.objects.filter(Q(width=0) | Q(height=0))
        bar = tqdm(total=images.count())

        for image in images:
            w, h = otapick.get_image_w_h(image)
            image.width = w
            image.height = h
            add_images.append(image)
            bar.update(1)

            if len(add_images) > 100:
                Image.objects.bulk_update(
                    add_images, fields=["width", "height"], batch_size=10000
                )
                add_images = []

        Image.objects.bulk_update(
            add_images, fields=["width", "height"], batch_size=10000
        )
