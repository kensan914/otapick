from django.core.management.base import BaseCommand
from ...models import Member


class Command(BaseCommand):
    help = 'register member information from memberList.'

    def handle(self, *args, **options):
        fin = open('static/courpus/memberList.txt', 'rt', encoding='utf-8')
        lines = fin.readlines()
        fin.close()

        keyList = ['id', 'last_kanji', 'first_kanji', 'full_kanji', 'last_kana', 'first_kana', 'full_kana', 'filename',
                   'group_id']

        for line in lines:
            member = {}
            line = line.replace('\n', '')
            for key, val in zip(keyList, list(line.split(' '))):
                member[key] = val

            if Member.objects.filter(ct=int(member['id']), belonging_group_id=int(member['group_id'])).exist():
                Member.objects.create(
                    ct=int(member['id']),
                    last_kanji=member['last_kanji'],
                    first_kanji=member['first_kanji'],
                    full_kanji=member['full_kanji'],
                    last_kana=member['last_kana'],
                    first_kana=member['first_kana'],
                    full_kana=member['full_kana'],
                    belonging_group_id=int(member['group_id'])
                )