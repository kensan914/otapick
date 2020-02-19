from django.core.management.base import BaseCommand
import time
from search.scripts.blogRegister.registerer import register_byMember
from search.scripts.blogRegister.dialogue import *


class Command(BaseCommand):
    help = 'register keyaki blog information by scrayping.'

    def handle(self, *args, **options):
        sleep_time_membertransition = 1

        print('スクレイピングを開始します。byGroup')

        group, group_id = which_group()
        if group_id == 0:
            quit()
        print(group.name + 'が選択されました。')

        page = howmany_pages()
        if page == 0:
            quit()

        answer = final_confirm(group.name)
        if answer:
            print(group.name + 'のブログを各メンバー' + str(page) + 'ページずつ取得します。')
        else:
            quit()

        for member in Member.objects.filter(belonging_group__group_id=group_id):
            register_byMember(member, all_check=False, up_limit=page)
            time.sleep(sleep_time_membertransition)

        # if group_id == 1:
        #     for member in Member.objects.filter(belonging_group__group_id=1):
        #         blogRegister_byMember(member, all_check=False, up_limit=page)
        #         time.sleep(sleep_time_membertransition)
        # elif group_id == 2:
        #     for member in Member.objects.filter(belonging_group__group_id=2):
        #         blogRegister_byMember(member, all_check=False, up_limit=page)
        #         time.sleep(sleep_time_membertransition)
