from datetime import datetime
from download.models import Image
from search.models import Member
from top.views import BaseView
from search.scripts.firstClassifier import nameClassifier
from django.shortcuts import redirect
from django.views import generic
import random


def convert_css_class(group_id):
    if group_id == 1:
        return 'keyaki'
    elif group_id == 2:
        return 'hinata'


def searchByMembers_init(self):
    group_id = self.kwargs.get('group_id')
    ct = self.kwargs.get('ct')
    member = Member.objects.get(ct=ct, belonging_group__group_id=int(group_id))
    order_format = self.request.GET.get('sort')
    narrowing_keyword = self.request.GET.get('keyword')
    narrowing_post = self.request.GET.get('post')

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
    return group_id, ct, member, order_format, narrowing_post_dic, narrowing_keyword


def get_q_member(self, isListView):
    if self.request.GET.get('q'):
        return BaseView.get(self, self.request)
    elif self.request.GET.get('q_member'):
        searchText = self.request.GET.get('q_member')
        result = nameClassifier({'searchText': searchText})
        if result['class'] == 'appropriate':
            return redirect('search:searchMember', searchText=searchText)
        else:
            return redirect('search:searchUnjustMember')
    else:
        if isListView:
            return generic.ListView.get(self, self.request)
        else:
            base_view = BaseView()
            base_view.context['appropriate'] = False
            base_view.html_path = 'search/otapick_searchMember.html'
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
