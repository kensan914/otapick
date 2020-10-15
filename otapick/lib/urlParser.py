from urllib.parse import urlparse, parse_qs

from main.models import Group

'''
検索したときのqパラメータを解析
ユーザが使うのは、インタフェースとなるparse_q()のみ。
dictionaryのresultを返す。
result = {
    (common)
    text: もともとのqパラメータ
    type: 'url' or 'member'
    
    (only if type == 'url')
    class: 'detail' or 'searchByLatest' or 'searchByMembers' or 'searchByBlogs' or 'unjust'
    parsed_url : urlparse()で解析された結果
    (group_id):
    (blog_ct):
    (ct):
    (page):
    (dy): year, month, day をkeyとして持つdictionary
    
    (only if type == 'member')
    class: 'appropriate' or 'unjust' (該当するmemberが存在するとかいうことではなく、不正か否か。)
}
'''

def parse_q(text):
    result = {'text': text}
    parsed_url = urlparse(text)
    if len(parsed_url.scheme) > 0:
        result['type'] = 'url'
        result['parsed_url'] = parsed_url
        return parse_url(result)
    else:
        result['type'] = 'member'
        return parse_text(result)


def parse_url(result):
    o = result['parsed_url']
    splitO = [i for i in o.path.split('/') if i != '']
    query_set = parse_qs(o.query)
    for group in Group.objects.all():
        if o.netloc == group.domain:
            result['group_id'] = group.group_id
            if len(splitO) > 3:
                return classify_url(result, splitO, query_set)
    result['class'] = 'unjust'
    return result


def classify_url(result, splitO, query_set):
    result['page'] = 1

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
        if 'ct' in query_set:
            result['ct'] = query_set['ct'][0]
            result['class'] = 'searchByMembers'
        else:
            result['class'] = 'searchByBlogs'
        if 'dy' in query_set:
            result['dy'] = get_dy(query_set['dy'][0])
        else:
            result['dy'] = None
        return result
    else:
        result['class'] = 'unjust'
        return result

# 時間指定されているときの"dy"パラメータを解析し、year, month, day をkeyとして持つdictionaryを作成。
def get_dy(dy_text):
    dy = {}
    try:
        dy['year'] = int(dy_text[0:4])
        dy['month'] = int(dy_text[4:6])
    except:
        dy['year'] = None
        dy['month'] = None
    if len(dy_text) == 8:
        dy['day'] = int(dy_text[6:8])
    else:
        dy['day'] = None
    return dy



def parse_text(result):
    if not set(result['text']).isdisjoint({'/', '[', ']', '('}):
        result['class'] = 'unjust'
    else:
        result['class'] = 'appropriate'
    return result