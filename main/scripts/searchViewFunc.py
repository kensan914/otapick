import os
import subprocess
from datetime import datetime
from config.settings import BASE_DIR
from main.models import Member, Blog
from main.scripts.firstClassifier import nameClassifier
from django.shortcuts import redirect
from django.views import generic
import random
import urllib.parse
# from main.views import BaseView


def convert_css_class(group_id):
    if group_id == 1:
        return 'keyaki'
    elif group_id == 2:
        return 'hinata'


def blogList_init(self, is_member):
    group_id = self.kwargs.get('group_id')
    ct = self.kwargs.get('ct')
    if is_member:
        member = Member.objects.get(ct=ct, belonging_group__group_id=int(group_id))
    else:
        member = None

    order_format = self.request.GET.get('sort')
    narrowing_keyword = self.request.GET.get('keyword')
    narrowing_post = self.request.GET.get('post')
    page = self.request.GET.get('page')

    narrowing_post_dic = {}
    if narrowing_post:
        if narrowing_post.count('-') == 1:
            post_datetime = datetime.strptime(narrowing_post, '%Y-%m')
            post_date = post_datetime.date()
        elif narrowing_post.count('-') == 2:
            post_datetime = datetime.strptime(narrowing_post, '%Y-%m-%d')
            post_date = post_datetime.date()
            narrowing_post_dic['day'] = post_date.day
        else:
            return group_id, ct, member, order_format, narrowing_post_dic, narrowing_keyword
        narrowing_post_dic['month'] = post_date.month
        narrowing_post_dic['year'] = post_date.year
    return group_id, ct, member, order_format, narrowing_post_dic, narrowing_keyword, page


def get_q_member(self, isListView, BaseView):
    if self.request.GET.get('q'):
        return BaseView.get(self, self.request)
    elif self.request.GET.get('q_member'):
        searchText = self.request.GET.get('q_member')
        result = nameClassifier({'searchText': searchText})
        if result['class'] == 'appropriate':
            return redirect('main:searchMember', searchText=searchText)
        else:
            return redirect('main:searchUnjustMember')
    else:
        if isListView:
            return generic.ListView.get(self, self.request)
        else:
            base_view = BaseView()
            base_view.context['appropriate'] = False
            base_view.html_path = 'main/searchMember.html'
            return base_view.get(self.request)


def kw_placeholder(group_id=1):
    words = ['ライブ', '握手会', ]
    rand_num = random.randint(0, len(words)-1)
    return words[rand_num]


ini_correspondence_dict = {
    'あ': ['a', 'i', 'u', 'e', 'o'],
    'か': 'k',
    'さ': 's',
    'た': 't',
    'な': 'n',
    'は': 'h',
    'ま': 'm',
    'や': 'y',
    'ら': 'r',
    'わ': 'w',
}


def member_initial_narrower(i_letter):
    members = Member.objects.filter(full_eng__iregex=r'^%s' % ini_correspondence_dict[i_letter])
    return members


def convert_eng(i_letter):
    if not i_letter:
        return None
    elif i_letter == 'あ':
        return ini_correspondence_dict[i_letter][0]
    else:
        return ini_correspondence_dict[i_letter]


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


def remove_query(url, key):
    pr = urllib.parse.urlparse(url)
    d = urllib.parse.parse_qs(pr.query)
    d.pop(key, None)
    return urllib.parse.urlunparse(pr._replace(query=urllib.parse.urlencode(d, doseq=True)))


def get_blog(group_id, blog_ct):
    writer_belonging = Member.objects.filter(belonging_group__group_id=group_id)
    try:
        blog = Blog.objects.get(writer__in=writer_belonging, blog_ct=blog_ct)
    except:
        try:
            subprocess.call(['python', os.path.join(BASE_DIR, 'manage.py'), 'keepUpLatest'])
        except:
            print("subprocess.check_call() failed")
        try:
            blog = Blog.objects.get(writer__in=writer_belonging, blog_ct=blog_ct)
        except:
            return None
    return blog
