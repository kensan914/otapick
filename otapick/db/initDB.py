from image.models import Progress
from main.models import Group, Member


def init_group():
    fin = open('static/courpus/groupList.txt', 'rt', encoding='utf-8')
    lines = fin.readlines()
    fin.close()

    keyList = ['name', 'group_id', 'netloc']
    for line in lines:
        group = {}
        line = line.replace('\n', '')
        for key, val in zip(keyList, list(line.split(' '))):
            group[key] = val
        if not Group.objects.filter(name=group['name'], netloc=group['netloc']).exists():
            Group.objects.create(
                name=group['name'],
                group_id=int(group['group_id']),
                netloc=group['netloc']
            )
            print(group['name'], 'is registered!')


def create_dict(line, keyList):
    member = {}
    for key, val in zip(keyList, list(line.split(' '))):
        if val.lower() == 'true':
            val = True
        elif val.lower() == 'false':
            val = False
        elif key == 'group_id' or key == 'generation':
            val = int(val)
        member[key] = val
    return member


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
            print(member['full_kanji'], 'is registered!')

        else:
            target_member = Member.objects.get(ct=member['ct'], belonging_group__group_id=member['group_id'])
            for key, val in member.items():
                if key == 'group_id':
                    if target_member.belonging_group.group_id != int(val):
                        print('{}の{}を{}に変更しました。'.format(target_member.full_kanji, key, int(val)))
                        target_member.belonging_group = Group.objects.get(group_id=int(val))
                # https://oshiete.goo.ne.jp/qa/8952513.html
                elif target_member.__dict__[key] != val:
                    print('{}の{}を{}に変更しました。'.format(target_member.full_kanji, key, val))
                    target_member.__dict__[key] = val
                target_member.save()

def init_progress(blog):
    if not Progress.objects.filter(target=blog).exists():
        progress = Progress(target=blog)
        progress.num = 100
        progress.ready = True
        progress.save()
