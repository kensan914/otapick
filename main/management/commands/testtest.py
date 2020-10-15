from django.core.management import BaseCommand
import otapick


class Command(BaseCommand):
    help = 'test'

    def handle(self, *args, **options):
        result = None

        # sakura
        # result = otapick.MemberImageCrawler().crawl('sakura', '03')
        # result = otapick.BlogImageCrawler().crawl('sakura', 36102)
        # result = otapick.BlogListCrawler().crawl('sakura', 0)
        # result = otapick.BlogDetailCrawler().crawl('sakura', 36098)
        # result = otapick.TextCrawler().crawl('sakura', 36098)

        # keyaki
        # result = otapick.MemberImageCrawler().crawl('keyaki', '03')
        # result = otapick.BlogImageCrawler().crawl('keyaki', 36075)
        # result = otapick.BlogListCrawler().crawl('keyaki', 0)
        # result = otapick.BlogDetailCrawler().crawl('keyaki', 36075)
        # result = otapick.TextCrawler().crawl('keyaki', 36075)

        # return
        otapick.print_console(result)
