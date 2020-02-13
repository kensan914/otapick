# coding=utf-8
from urllib.parse import urlparse
from django.db.models import Q
from ..models import Member


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
        matchMembers = []
        for member in Member.objects.filter(Q(full_kana__icontains=searchText) | Q(full_kanji__icontains=searchText)):
            matchMembers.append(member)
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
