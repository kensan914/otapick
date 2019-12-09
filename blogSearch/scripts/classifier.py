# coding=utf-8
from urllib.parse import urlparse


def searchTextClassifier(searchText):
    o = urlparse(searchText)
    result = {'searchText': searchText}
    if len(o.scheme) > 0:
        splitO = [i for i in o.path.split('/') if i != '']
        result['input'] = 'url'
        if o.netloc == 'www.keyakizaka46.com':
            if len(splitO) > 3:
                if splitO[3] == 'detail':
                    result['class'] = 'detail'
                    result['group'] = 'keyaki'
                    return result
                elif len(splitO) == 4 and splitO[3] == 'member':
                    result['class'] = 'searchByBlogs'
                    result['group'] = 'keyaki'
                    return result
                elif len(splitO) == 5 and splitO[3] == 'member' and splitO[4] == 'list':
                    result['class'] = 'searchByMembers'
                    result['group'] = 'keyaki'
                    return result
        elif o.netloc == 'www.hinatazaka46.com':
            if len(splitO) > 3:
                if splitO[3] == 'detail':
                    result['class'] = 'detail'
                    result['group'] = 'hinata'
                    return result
                elif len(splitO) == 4 and splitO[3] == 'member':
                    result['class'] = 'searchByBlogs'
                    result['group'] = 'hinata'
                    return result
                elif len(splitO) == 5 and splitO[3] == 'member' and splitO[4] == 'list':
                    result['class'] = 'searchByMembers'
                    result['group'] = 'hinata'
                    return result

    else:
        result['input'] = 'name'
        fin = open('static/courpus/memberList.txt', 'rt', encoding='utf-8')
        lines = fin.readlines()
        fin.close()
        matchMembers = []
        keyList = ['id', 'last_kanji', 'first_kanji', 'full_kanji', 'last_gana', 'first_gana', 'full_gana', 'filename',
                   'group_id']
        for line in lines:
            if searchText in line:
                pvsMatchMember = {}
                line = line.replace('\n', '')
                for key, val in zip(keyList, list(line.split(' '))):
                    pvsMatchMember[key] = val
                matchMembers.append(pvsMatchMember)
        if len(matchMembers) == 1:
            result['class'] = 'oneMemberHit'
            result['memberList'] = matchMembers
            return result
        elif len(matchMembers) > 1:
            result['class'] = 'someMembersHit'
            result['memberList'] = matchMembers
            return result

    result['class'] = '403'
    return result
