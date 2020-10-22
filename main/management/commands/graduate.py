from django.core.management.base import BaseCommand
import otapick
from main.models import Member, Blog


class Command(BaseCommand):
    help = 'graduate. 卒業するメンバーのテキストをまとめて保存。' \
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
            otapick.register_external(options['group'], options['ct'])
            print('finished crawl external!!')
            quit()

        if Member.objects.filter(belonging_group__group_id=options['group'], ct=options['ct']):
            member = Member.objects.get(belonging_group__group_id=options['group'], ct=options['ct'])
        else:
            print('member not found.')
            return

        # 本文DOMを所得
        for blog in Blog.objects.filter(writer=member):
            otapick.register_text(blog)
