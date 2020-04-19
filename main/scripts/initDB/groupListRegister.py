from main.models import Group


def initGroup():
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
