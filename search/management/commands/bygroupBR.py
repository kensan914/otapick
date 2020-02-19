from django.core.management.base import BaseCommand
import time
from search.scripts.blogRegister.keyakiBlogRegister import blogRegisterByM_keyaki
from search.scripts.blogRegister.hinataBlogRegister import blogRegisterByM_hinata
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

        if group_id == 1:
            for member in Member.objects.filter(belonging_group__group_id=1):
                blogRegisterByM_keyaki(member, all_check=False, up_limit=page)
                time.sleep(sleep_time_membertransition)
        elif group_id == 2:
            for member in Member.objects.filter(belonging_group__group_id=2):
                blogRegisterByM_hinata(member, up_limit=page)
                time.sleep(sleep_time_membertransition)
