from django.core.management.base import BaseCommand
from search.models import Member, Group


class Command(BaseCommand):
    help = 'register member information from memberList.'

    def handle(self, *args, **options):
        fin = open('static/courpus/memberList.txt', 'rt', encoding='utf-8')
        lines = fin.readlines()
        fin.close()

        keyList = ['id', 'last_kanji', 'first_kanji', 'full_kanji', 'last_kana', 'first_kana', 'full_kana', 'last_eng',
                   'first_eng', 'group_id']
        for line in lines:
            member = {}
            line = line.replace('\n', '')
            for key, val in zip(keyList, list(line.split(' '))):
                member[key] = val
            if not Member.objects.filter(ct=member['id'], belonging_group__group_id=int(member['group_id'])).exists():
                Member.objects.create(
                    ct=member['id'],
                    last_kanji=member['last_kanji'],
                    first_kanji=member['first_kanji'],
                    full_kanji=member['full_kanji'],
                    last_kana=member['last_kana'],
                    first_kana=member['first_kana'],
                    full_kana=member['full_kana'],
                    last_eng=member['last_eng'],
                    first_eng=member['first_eng'],
                    full_eng=member['last_eng']+member['first_eng'],
                    belonging_group=Group.objects.get(group_id=int(member['group_id'])),
                )
                print(member['full_kanji'], 'is registered!')
