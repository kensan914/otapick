from django.core.management.base import BaseCommand
import otapick
from main.models import Group


class Command(BaseCommand):
    help = 'keep up latest blog information by scrayping.' \
           '-g 0 => keyaki'

    def add_arguments(self, parser):
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2 or None). default:both')
        parser.add_argument('-p', '--page', type=int, help='set up_limit. default:100')
        parser.add_argument('-a', '--all', action='store_true', help='execute all_check. default:False')
        parser.add_argument('-u', '--unregister', type=int, help='set unregister_num. default:1')
        parser.add_argument('-t', '--tweet', action='store_true', help='tweet update info. default:False')

    def handle(self, *args, **options):
        up_limit = 100
        unregister_num = 1

        if not Group.objects.filter(group_id=options['group']).exists() and options['group'] is not None:
            if options['group'] != 0:
                print('groupID', options['group'], 'is not supported.')
                quit()

        if options['page']:
            up_limit = options['page']

        if options['unregister'] is not None:
            if options['unregister'] < 0:
                print('Please input positive integer.')
                quit()
            unregister_num = options['unregister']

        if options['group']:
            otapick.register_blogs(group_id=options['group'], up_limit=up_limit, all_check=options['all'], unregister_num=unregister_num, tweet=options['tweet'])
        else:
            for group in Group.objects.all():
                otapick.register_blogs(group_id=group.group_id, up_limit=up_limit, all_check=options['all'], unregister_num=unregister_num, tweet=options['tweet'])
