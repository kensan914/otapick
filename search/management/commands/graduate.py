from django.core.management.base import BaseCommand
from download import imgScraper
from download.models import Progress
from search.models import Blog
from search.scripts.blogRegister.textScraper import save_text


class Command(BaseCommand):
    help = 'graduate. 卒業するメンバーの画像、テキストをまとめて保存。'

    def add_arguments(self, parser):
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2). default:None')
        parser.add_argument('-ct', '--ct', type=str, help='set member_ct. default:None')

    def handle(self, *args, **options):
        if options['group'] != 1 and options['group'] != 2 or options['group'] is None:
            print('groupID', options['group'], 'is not supported.')
            quit()
        if options['ct'] is None:
            print('member_ct', options['ct'], 'is not supported.')
            quit()

        blogs = Blog.objects.filter(writer__belonging_group__group_id=options['group'], writer__ct=options['ct'])

        if not blogs:
            print('member not found.')
            quit()

        for blog in blogs:
            if not Progress.objects.filter(target=blog).exists() or not Progress.objects.get(target=blog).ready:
                progress_instance = Progress.objects.create(target=blog)
                imgScraper.update(progress_instance.id, options['group'], blog.blog_ct, options['ct'])
                progress_instance.num = 100
                progress_instance.ready = True
                progress_instance.save()

            save_text(blog)
            print(blog.title, 'saved!!')
