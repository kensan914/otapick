from django.core.management.base import BaseCommand
import otapick
from main.models import Member


class Command(BaseCommand):
    help = 'メンバーの宣材写真を取得。すでに登録済みのメンバーは取得しない' \
           'groupオプションでグループを指定可能。 (default:全メンバー)' \
           'forceオプションで現役メンバーは強制ダウンロード。個人アー写が変わったタイミングで実行。' \
           'fforceオプションで全てのメンバーを強制ダウンロード。'

    def add_arguments(self, parser):
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2). default:None')
        parser.add_argument('-f', '--force', action='store_true', help='default:False')
        parser.add_argument('-ff', '--fforce', action='store_true', help='default:False')

    def handle(self, *args, **options):
        if options['group'] != 1 and options['group'] != 2 and options['group'] is not None:
            otapick.print_console('groupID {} is not supported.'.format(options['group']))
            quit()

        member_image_crawler = otapick.MemberImageCrawler()
        member_image_crawler_ex = otapick.MemberImageCrawlerEx()
        member_image_downloader = otapick.MemberImageDownloader()
        member_image_downloader_ex = otapick.MemberImageDownloaderEx()

        members = Member.objects.filter(temporary=False)
        members = members if options['group'] is None else members.filter(belonging_group__group_id=options['group'])
        for member in members:
            if not member.image or (options['force'] and not member.graduate) or options['fforce']:
                if not member.graduate:
                    image_url = member_image_crawler.crawl(member.belonging_group.key, member.ct)
                    media = member_image_downloader.download(image_url, member.belonging_group.group_id, member.ct)
                else:
                    image_url = member_image_crawler_ex.crawl(member.full_kanji)
                    media = member_image_downloader_ex.download(image_url, member.belonging_group.group_id, member.ct)
                if media is not None:
                    member.image = media
                    member.save()
                    otapick.print_console("{}'s image is saved!!".format(member.full_kanji))