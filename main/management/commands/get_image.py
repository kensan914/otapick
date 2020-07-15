from django.core.management.base import BaseCommand
import otapick
from main.models import Member


class Command(BaseCommand):
    help = '未取得の画像を取得。' \
           'allオプションで500x, 250xも作成。'

    def add_arguments(self, parser):
        parser.add_argument('-a', '--all', action='store_true', help='default:False')

    def handle(self, *args, **options):
        for member in Member.objects.all():
            if not member.graduate:
                otapick.download_images_by(member=member)
            if options['all']:
                otapick.compress_blog_images_by(member=member)
            print(member.full_kanji, 'completed!!')
