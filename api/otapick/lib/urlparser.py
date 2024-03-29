from urllib.parse import urlparse, parse_qs
from api.models.main.models import Group

"""
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
    (blog_list_paginate_by):
    
    (only if type == 'member')
    class: 'appropriate' or 'unjust' (該当するmemberが存在するとかいうことではなく、不正か否か。)
}
"""


def parse_q(text, is_mobile):
    result = {"text": text}
    parsed_url = urlparse(text)
    if len(parsed_url.scheme) > 0:
        result["type"] = "url"
        result["parsed_url"] = parsed_url
        return parse_url(result, is_mobile)
    else:
        result["type"] = "member"
        return parse_text(result)


def parse_url(result, is_mobile):
    o = result["parsed_url"]
    splitO = [i for i in o.path.split("/") if i != ""]
    query_set = parse_qs(o.query)
    for group in Group.objects.all():
        if o.netloc == group.domain:
            result["group_id"] = group.group_id

            # ↓searchByLatestであれば後に変更される
            result["blog_list_paginate_by"] = (
                group.blog_list_paginate_by_mobile
                if is_mobile
                else group.blog_list_paginate_by
            )
            if len(splitO) > 3:
                return classify_url(result, splitO, query_set, group, is_mobile)
    result["class"] = "unjust"
    return result


def classify_url(result, splitO, query_set, group, is_mobile):
    result["page"] = 1

    if splitO[3] == "detail":
        result["class"] = "detail"
        result["blog_ct"] = splitO[4]
        return result
    elif len(splitO) == 4 and (
        splitO[3] == "member" or (result["group_id"] == 1 and splitO[3] == "blog")
    ):
        result["class"] = "searchByLatest"
        result["blog_list_paginate_by"] = (
            group.latest_list_paginate_by_mobile
            if is_mobile
            else group.latest_list_paginate_by
        )
        return result
    elif (
        len(splitO) == 5
        and splitO[4] == "list"
        and (splitO[3] == "member" or (result["group_id"] == 1 and splitO[3] == "blog"))
    ):
        if "page" in query_set:
            result["page"] = int(query_set["page"][0]) + 1
        if "ct" in query_set:
            result["ct"] = query_set["ct"][0]
            result["class"] = "searchByMembers"
        else:
            result["class"] = "searchByBlogs"
        if "dy" in query_set:
            result["dy"] = get_dy(query_set["dy"][0])
        else:
            result["dy"] = None
        return result
    else:
        result["class"] = "unjust"
        return result


# 時間指定されているときの"dy"パラメータを解析し、year, month, day をkeyとして持つdictionaryを作成。


def get_dy(dy_text):
    dy = {}
    try:
        dy["year"] = int(dy_text[0:4])
        dy["month"] = int(dy_text[4:6])
    except:
        dy["year"] = None
        dy["month"] = None
    if len(dy_text) == 8:
        dy["day"] = int(dy_text[6:8])
    else:
        dy["day"] = None
    return dy


def parse_text(result):
    if not set(result["text"]).isdisjoint({"/", "[", "]", "("}):
        result["class"] = "unjust"
    else:
        result["class"] = "appropriate"
    return result
