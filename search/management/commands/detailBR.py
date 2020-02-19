from django.core.management.base import BaseCommand
from search.scripts.blogRegister.keyakiBlogRegister import blogRegisterByM_keyaki
from search.scripts.blogRegister.hinataBlogRegister import blogRegisterByM_hinata
from search.scripts.blogRegister.dialogue import *


class Command(BaseCommand):
    help = 'detail register blog information by scrayping.'

    def handle(self, *args, **options):
        print('スクレイピングを開始します。byMember')

        group, group_id = which_group()
        if group_id == 0:
            quit()
        print(group.name + 'が選択されました。')

        member, ct = which_member(group_id)
        if ct == '0':
            quit()
        print(member.full_kanji + 'が選択されました。')

        page = howmany_pages()
        if page == 0:
            quit()

        answer = final_confirm(member.full_kanji)
        if answer:
            print(member.full_kanji + 'のブログを' + str(page) + 'ページ取得します。')
        else:
            quit()

        if group_id == 1:
            blogRegisterByM_keyaki(member, all_check=True, up_limit=page)
        elif group_id == 2:
            blogRegisterByM_hinata(member, up_limit=page)
