from main.models import Group, Member
from otapick.lib.utils import print_console


def init_group():
    fin = open('static/courpus/groupList.txt', 'rt', encoding='utf-8')
    lines = fin.readlines()
    fin.close()

    keyList = ['name', 'group_id', 'domain', 'key', 'is_active', 'blog_list_paginate_by', 'blog_url_format', 'member_url_format']
    for line in lines:
        # group = {}
        line = line.replace('\n', '')
        # for key, val in zip(keyList, list(line.split(' '))):
        #     group[key] = val
        group = create_dict(line, keyList)

        groups = Group.objects.filter(group_id=group['group_id'])
        if not groups.exists():
            Group.objects.create(
                name=group['name'],
                group_id=int(group['group_id']),
                domain=group['domain'],
                key=group['key'],
                is_active=group['is_active'],
                blog_list_paginate_by=group['blog_list_paginate_by'],
                blog_url_format=group['blog_url_format'],
                member_url_format=group['member_url_format'],
            )
            print_console('{} is registered!'.format(group['name']))
        else:
            target_group = groups.first()
            for key, val in group.items():
                if key == 'group_id':
                    if target_group.group_id != int(val):
                        print_console('{}の{}を{}に変更しました。'.format(target_group.name, key, int(val)))
                        target_group.group_id = int(val)
                # https://oshiete.goo.ne.jp/qa/8952513.html
                elif target_group.__dict__[key] != val:
                    print_console('{}の{}を{}に変更しました。'.format(target_group.name, key, val))
                    target_group.__dict__[key] = val
                target_group.save()


def init_member():
    fin = open('static/courpus/memberList.txt', 'rt', encoding='utf-8')
    lines = fin.readlines()
    fin.close()

    keyList = ['ct', 'last_kanji', 'first_kanji', 'full_kanji', 'last_kana', 'first_kana', 'full_kana', 'last_eng',
               'first_eng', 'group_id', 'graduate', 'independence', 'temporary', 'generation']
    for line in lines:
        line = line.replace('\n', '')
        member = create_dict(line, keyList)

        if not Member.objects.filter(ct=member['ct'], belonging_group__group_id=member['group_id']).exists():
            Member.objects.create(
                ct=member['ct'],
                last_kanji=member['last_kanji'],
                first_kanji=member['first_kanji'],
                full_kanji=member['full_kanji'],
                last_kana=member['last_kana'],
                first_kana=member['first_kana'],
                full_kana=member['full_kana'],
                last_eng=member['last_eng'],
                first_eng=member['first_eng'],
                full_eng=member['last_eng']+member['first_eng'],
                belonging_group=Group.objects.get(group_id=member['group_id']),
                graduate=member['graduate'],
                independence=member['independence'],
                temporary=member['temporary'],
                generation=member['generation'],
            )
            print_console('{} is registered!'.format(member['full_kanji']))

        else:
            target_member = Member.objects.get(ct=member['ct'], belonging_group__group_id=member['group_id'])
            for key, val in member.items():
                if key == 'group_id':
                    if target_member.belonging_group.group_id != int(val):
                        target_member.belonging_group = Group.objects.get(group_id=int(val))
                        print_console('{}の{}を{}に変更しました。'.format(target_member.full_kanji, key, int(val)))
                # https://oshiete.goo.ne.jp/qa/8952513.html
                elif target_member.__dict__[key] != val:
                    target_member.__dict__[key] = val
                    print_console('{}の{}を{}に変更しました。'.format(target_member.full_kanji, key, val))
                target_member.save()


def create_dict(line, keyList):
    obj = {}
    for key, val in zip(keyList, list(line.split(' '))):
        if val.lower() == 'true':
            val = True
        elif val.lower() == 'false':
            val = False
        elif key == 'group_id' or key == 'generation' or key == 'blog_list_paginate_by':
            val = int(val)
        obj[key] = val
    return obj
