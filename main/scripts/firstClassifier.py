from urllib.parse import urlparse, parse_qs


def firstClassifier(searchText):
    o = urlparse(searchText)
    first_result = {'searchText': searchText}
    if len(o.scheme) > 0:
        splitO = [i for i in o.path.split('/') if i != '']
        query_set = parse_qs(o.query)
        first_result['input'] = 'url'
        if o.netloc == 'www.keyakizaka46.com':
            first_result['group_id'] = 1
            if len(splitO) > 3:
                return urlClassifier(first_result, splitO, query_set)

        elif o.netloc == 'www.hinatazaka46.com':
            first_result['group_id'] = 2
            if len(splitO) > 3:
                return urlClassifier(first_result, splitO, query_set)
        first_result['class'] = 'unjustURL'
        return first_result
    else:
        return nameClassifier(first_result)


def urlClassifier(result, splitO, query_set):
    if splitO[3] == 'detail':
        result['class'] = 'detail'
        result['blog_ct'] = splitO[4]
        return result
    elif len(splitO) == 4 and splitO[3] == 'member':
        result['class'] = 'searchByLatest'
        return result
    elif len(splitO) == 5 and splitO[3] == 'member' and splitO[4] == 'list':
        if 'page' in query_set:
            result['page'] = int(query_set['page'][0]) + 1
        else:
            result['page'] = 1
        if 'ct' in query_set:
            result['ct'] = query_set['ct'][0]
            result['class'] = 'searchByMembers'
        else:
            result['class'] = 'searchByBlogs'
        if 'dy' in query_set:
            result['dy'] = query_set['dy'][0]
        else:
            result['dy'] = None
        return result
    else:
        result['class'] = 'unjustURL'
        return result

def nameClassifier(result):
    result['input'] = 'name'
    if '/' in result['searchText']:
        result['class'] = 'unjustMember'
    else:
        result['class'] = 'appropriate'
    return result

def dy_insert_hyphen(dy_text):
    dy = ''
    if len(dy_text) >= 6:
        dy += dy_text[0:4] + '-' + dy_text[4:6]
        if len(dy_text) == 8:
            dy += '-' + dy_text[6:8]
    return dy