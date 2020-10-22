from django.core.management.base import BaseCommand
import otapick
from main.models import Member


class Command(BaseCommand):
    help = '全ての画像を圧縮。' \
           'allオプションで500x, 250xも作成。'

    def handle(self, *args, **options):
        for member in Member.objects.all():
            otapick.compress_blog_images_by(member=member)
            print(member.full_kanji, 'completed!!')
