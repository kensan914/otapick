from django.core.management import BaseCommand
import otapick
from main.models import Blog, Group


class Command(BaseCommand):
    help = 'test'

    def handle(self, *args, **options):
        keyaki = Group.objects.get(group_id=3)

        # publishing_groupをセット
        for blog in Blog.objects.all():
            if blog.writer.belonging_group.group_id == 1:
                blog.publishing_group = keyaki
            elif blog.writer.belonging_group.group_id == 2:
                blog.publishing_group = blog.writer.belonging_group
            blog.save()

        otapick.print_console('デフォルトセット完了')

        sakura = Group.objects.get(group_id=1)
        blog_crawler = otapick.BlogListCrawler()
        for page in range(10):
            blogs_data = blog_crawler.crawl('sakura', page)
            for blog_info in blogs_data:
                blogs = Blog.objects.filter(blog_ct=blog_info['blog_ct'])
                if blogs.exists():
                    blog = blogs.first()
                    blog.publishing_group = sakura
                    blog.save()
                    otapick.print_console('「{}」changed to 櫻坂'.format(blog.title))
                else:
                    otapick.print_console('ブログが存在しません')
