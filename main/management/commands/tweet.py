from django.core.management.base import BaseCommand
import otapick
from main.models import Group


class Command(BaseCommand):
    help = 'tweet update information.'

    def add_arguments(self, parser):
        parser.add_argument('--view', action='store_true', help='view or dl. default:False')
        parser.add_argument('--dl', action='store_true', help='view or dl. default:False')
        parser.add_argument('--blog', action='store_true', help='blog or image. default:False')
        parser.add_argument('--image', action='store_true', help='blog or image. default:False')
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2). default:None')
        parser.add_argument('-y', '--yesterday', action='store_true', help='default:False')

    def handle(self, *args, **options):
        if not Group.objects.filter(group_id=options['group']).exists() and options['group'] is not None:
            print('groupID', options['group'], 'is not supported.')
            quit()

        if not options['view'] ^ options['dl']:
            print('type error.')
            quit()

        if not options['blog'] ^ options['image'] and options['view']:
            print('mode error.')
            quit()

        if options['blog']: mode = 'blog'
        elif options['image']: mode = 'image'
        else: mode = ''

        if options['view']:
            otapick.ViewBot().tweet(group_id=options['group'], blog_or_image=mode, today=not options['yesterday'])
        elif options['dl']:
            otapick.DLBot().tweet(group_id=options['group'])
