from django.db.models import Q
from main.models import Member, Blog

'''
search_blogs() search_members()
引数として渡されたqパラメータ情報(parse_q()で返されたdictionary)から、それぞれ合致したクエリセットを返す。

'''

def search_blogs(q_info):
    if q_info['class'] == 'detail':
        blogs = Blog.objects.filter(writer__belonging_group__group_id=q_info['group_id'], blog_ct=q_info['blog_ct'])
    elif q_info['class'] == 'searchByLatest':
        blogs = Blog.objects.filter(writer__belonging_group__group_id=q_info['group_id'], writer__graduate=False).order_by('-post_date', 'order_for_simul')
    elif q_info['class'] == 'searchByBlogs':
        blogs = Blog.objects.filter(writer__belonging_group__group_id=q_info['group_id'], writer__graduate=False)
        if q_info['dy'] and q_info['dy']['year'] and q_info['dy']['month']:
            blogs = search_blogs_by_dy(blogs, q_info['dy'])
        else:
            blogs = blogs.order_by('-post_date', 'order_for_simul')
    elif q_info['class'] == 'searchByMembers':
        blogs = Blog.objects.filter(writer__belonging_group__group_id=q_info['group_id'], writer__ct=q_info['ct'])
        if q_info['dy'] and q_info['dy']['year'] and q_info['dy']['month']:
            blogs = search_blogs_by_dy(blogs, q_info['dy'])
        else:
            blogs = blogs.order_by('-post_date', 'order_for_simul')
    else:
        return

    if blogs.exists(): return blogs
    else: return

def search_blogs_by_dy(origin_blogs, dy):
    dy_blogs = origin_blogs.filter(post_date__year=dy['year'], post_date__month=dy['month'])
    if dy['day']:
        return dy_blogs.filter(post_date__day=dy['day']).order_by('-post_date', 'order_for_simul')
    else:
        return dy_blogs.order_by('-post_date', 'order_for_simul')


def search_members(q_info):
    # 全角⇒半角
    cleaned_text = q_info['text'].translate(str.maketrans({chr(0xFF01 + i): chr(0x21 + i) for i in range(94)}))
    members =  Member.objects.filter(
        Q(full_kana__iregex=r'^%s' % cleaned_text) | Q(first_kana__iregex=r'^%s' % cleaned_text) |
        Q(full_kanji__iregex=r'^%s' % cleaned_text) | Q(first_kanji__iregex=r'^%s' % cleaned_text) |
        Q(full_eng__iregex=r'^%s' % cleaned_text) | Q(first_eng__iregex=r'^%s' % cleaned_text)
    )
    if members.exists(): return members
    else: return
