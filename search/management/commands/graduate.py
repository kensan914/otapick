from django.core.management.base import BaseCommand
from download import imgScraper
from download.models import Progress
from search.models import Blog
from search.scripts.blogRegister.registerer_ex import register_external
from search.scripts.blogRegister.textScraper import save_text


class Command(BaseCommand):
    help = 'graduate. 卒業するメンバーの画像、テキストをまとめて保存。' \
           'group, ct オプションでメンバーを指定。' \
           '任意オプションexternalで、外部から収集を指定。'

    def add_arguments(self, parser):
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2). default:None')
        parser.add_argument('-ct', '--ct', type=str, help='set member_ct. default:None')
        parser.add_argument('-e', '--external', action='store_true', help='set external. default:False')

    def handle(self, *args, **options):
        if options['group'] != 1 and options['group'] != 2 or options['group'] is None:
            print('groupID', options['group'], 'is not supported.')
            quit()
        if options['ct'] is None:
            print('member_ct', options['ct'], 'is not supported.')
            quit()

        # crawl external
        if options['external']:
            register_external(options['group'], options['ct'])
            print('finished crawl external!!')
            quit()

        blogs = Blog.objects.filter(writer__belonging_group__group_id=options['group'], writer__ct=options['ct'])

        if not blogs:
            print('member not found.')
            quit()

        for blog in blogs:
            if Progress.objects.filter(target=blog).exists():
                progress = Progress.objects.get(target=blog)
                if progress.num < 100 or not progress.ready:
                    progress.delete()

            if not Progress.objects.filter(target=blog).exists():
                progress_instance = Progress.objects.create(target=blog)
                imgScraper.update(progress_instance.id, options['group'], blog.blog_ct, options['ct'])
                progress_instance.num = 100
                progress_instance.ready = True
                progress_instance.save()

            save_text(blog)
            print(blog.title, 'saved!!')
