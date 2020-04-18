from django.core.management.base import BaseCommand
from search.scripts.blogRegister.registerer import register_latest


class Command(BaseCommand):
    help = 'keep up latest blog information by scrayping.'

    def add_arguments(self, parser):
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2 or None). default:both')
        parser.add_argument('-p', '--page', type=int, help='set up_limit. default:100')
        parser.add_argument('-a', '--all', action='store_true', help='execute all_check. default:False')
        parser.add_argument('-u', '--unregister', type=int, help='set unregister_num. default:1')

    def handle(self, *args, **options):
        up_limit = 100
        unregister_num = 1

        if options['group'] != 1 and options['group'] != 2 and options['group'] is not None:
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
            register_latest(group_id=options['group'], up_limit=up_limit, all_check=options['all'], unregister_num=unregister_num)
        else:
            register_latest(group_id=1, up_limit=up_limit, all_check=options['all'], unregister_num=unregister_num)
            register_latest(group_id=2, up_limit=up_limit, all_check=options['all'], unregister_num=unregister_num)
