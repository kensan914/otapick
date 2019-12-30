from django.core.management.base import BaseCommand
from ...models import Member, Group

from .keyakiBlogRegister import blogRegisterByM_keyaki
from .hinataBlogRegister import blogRegisterByM_hinata


class Command(BaseCommand):
    help = 'detail register blog information by scrayping.'

    def handle(self, *args, **options):
        print('スクレイピングを開始します。')
        while True:
            input_group_id = input('まず、実行するグループのgroup_idを教えてください：')
            if input_group_id == 'q':
                quit()
            group_id = int(input_group_id)
            try:
                group = Group.objects.get(group_id=group_id)
            except:
                print(int(group_id), 'のgroup_idを持つグループは見つかりませんでした。')
                group_id = 0
                continue
            if group_id != 0:
                break

        print(group.name + 'が選択されました。')
        while True:
            global ct
            ct = input('次に、実行するメンバーのct番号を教えてください：')
            if ct == 'q':
                quit()
            try:
                member = Member.objects.get(ct=ct, belonging_group__group_id=group_id)
            except:
                print(ct, 'のct番号を持つメンバーは見つかりませんでした。')
                ct = ''
                continue
            if ct != '':
                break
        print(member.full_kanji + 'が選択されました。')
        while True:
            answer = input(member.full_kanji + 'のスクレイピングを開始します。よろしいですか？(y or n):')
            if answer == 'y':
                break
            elif answer == 'n' or answer == 'q':
                quit()
        print('start scraping blog written by ' + member.full_kanji)

        if group_id == 1:
            blogRegisterByM_keyaki(member, allCheck=True)
        elif group_id == 2:
            blogRegisterByM_hinata(member)
