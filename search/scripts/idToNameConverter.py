def idToNameConverter(id, group):
    fin = open('static/courpus/memberList.txt', 'rt', encoding='utf-8')
    lines = fin.readlines()
    fin.close()
    keyList = ['id', 'last_kanji', 'first_kanji', 'full_kanji', 'last_gana', 'first_gana', 'full_gana', 'filename',
               'group_id']
    for line in lines:
        if id in line:
            pvsMatchMember = {}
            line = line.replace('\n', '')
            for key, val in zip(keyList, list(line.split(' '))):
                pvsMatchMember[key] = val
            if pvsMatchMember['id'] == id and pvsMatchMember['group_id'] == group:
                return pvsMatchMember['full_kanji']
    return 0
