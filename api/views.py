import urllib.parse
from rest_framework import status, views
from rest_framework.response import Response
from api.serializers import *
from config import settings
from main.models import Member, Blog
import otapick


# {'keyaki': [[1期生], [2期生]], 'hinata': [[1期生], [2期生], [3期生]]} ☚今後、メンバーが増えてもこのクラスをいじる必要はない
class MemberListAPIView(views.APIView):
    def generate_member_list(self, members): # generate member list separated by its generation.
        member_dict = {}  # key is its generation.
        for member in members:
            if not str(member.generation) in member_dict: member_dict[str(member.generation)] = []
            member_dict[str(member.generation)].append(member)
        sorted_members = sorted(member_dict.items())  # [('1', [<石森>, <今泉>,...]), ('2', [<井上>, <遠藤>,...])]
        member_list = [member_tuple[1] for member_tuple in sorted_members]  # [[<石森>, <今泉>,...], [<井上>, <遠藤>,...]]
        return member_list

    def get(self, request, *args, **kwargs):
        keyaki_members = Member.objects.filter(belonging_group__group_id=1).exclude(generation=0)
        keyaki_member_list = self.generate_member_list(keyaki_members)
        for i, target in enumerate(keyaki_member_list):
            keyaki_member_list[i] = MemberSerializer(target, many=True).data

        hinata_members = Member.objects.filter(belonging_group__group_id=2).exclude(generation=0)
        hinata_member_list = self.generate_member_list(hinata_members)
        for i, target in enumerate(hinata_member_list):
            hinata_member_list[i] = MemberSerializer(target, many=True).data

        data = {
            'keyaki': keyaki_member_list,
            'hinata': hinata_member_list,
        }
        return Response(data, status.HTTP_200_OK)

memberListAPIView = MemberListAPIView.as_view()


class BlogDetailAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct).exists():
            blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
            blog_data = BlogSerializerVerDetail(blog).data
            images = Image.objects.filter(publisher=blog).order_by('order')
            blog_data['images'] = ImageSerializer(images, many=True).data
            blog_data['status'] = 'success'
            return Response(blog_data, status.HTTP_200_OK)
        else:
            return Response({'status': 'blog_not_found', 'message': 'blog not found'}, status.HTTP_200_OK)

blogDetailAPIView = BlogDetailAPIView.as_view()


class BlogListAPIView(views.APIView):
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(self.kwargs.get('group_id'), self.kwargs.get('ct'))
        order_format = self.request.GET.get('sort')
        narrowing_keyword = self.request.GET.get('keyword')
        narrowing_post = self.request.GET.get('post')
        page = int(self.request.GET.get('page')) if self.request.GET.get('page') is not None else 1

        narrowing_blogs = \
            Blog.objects.filter(writer__belonging_group__group_id=group_id) if ct is None \
            else Blog.objects.filter(writer__belonging_group__group_id=group_id, writer__ct=ct)
        narrowing_blogs = otapick.sort_blogs(narrowing_blogs, order_format)
        narrowing_blogs = otapick.narrowdown_blogs_keyword(narrowing_blogs, narrowing_keyword)
        narrowing_blogs = otapick.narrowdown_blogs_post(narrowing_blogs, narrowing_post)

        blogs = narrowing_blogs[self.paginate_by * ( page - 1 ): self.paginate_by * page]
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

blogListAPIView = BlogListAPIView.as_view()


class BlogListInfoAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(self.kwargs.get('group_id'), self.kwargs.get('ct'))
        order_format = self.request.GET.get('sort')
        narrowing_keyword = self.request.GET.get('keyword')
        narrowing_post = self.request.GET.get('post')

        return Response(otapick.BlogListInfo(group_id, ct, order_format, narrowing_keyword, narrowing_post).get_result(), status.HTTP_200_OK)


blogListInfoAPIView = BlogListInfoAPIView.as_view()


class SearchAPIView(views.APIView):
    paginate_by = 20
    q = ''

    def serialize_blogs(self, blogs):
        # TODO デプロイ時、直す
        if settings.DEBUG:
            return BlogSerializer(blogs, many=True).data
        else:
            return BlogSerializerVerOrderly(blogs, many=True).data

        # return BlogSerializerVerOrderly(blogs, many=True).data

    def serialize_members(self, members):
        return MemberSerializer(members, many=True).data

    def get(self, request, *args, **kwargs):
        self.q = self.request.GET.get('q')
        if self.q:
            result = otapick.parse_q(self.q)
            if result['type'] == 'url':
                if result['class'] != 'unjust':
                    blogs = otapick.search_blogs(result)
                    if blogs is not None:
                        if result['class'] == 'searchByLatest':
                            if result['group_id'] == 1:
                                self.paginate_by = 10
                            elif result['group_id'] == 2:
                                self.paginate_by = 12
                        blogs = blogs[self.paginate_by * ( result['page'] - 1 ): self.paginate_by * result['page']]
                        blogs_data = self.serialize_blogs(blogs)

                        if result['class'] == 'searchByLatest': title = '欅坂46 最新ブログ' if result['group_id'] == 1 else '日向坂46 最新ブログ'
                        elif result['class'] == 'searchByMembers':
                            try: title = Member.objects.get(belonging_group__group_id=result['group_id'], ct=result['ct']).full_kanji
                            except : title = ''
                        elif result['class'] == 'searchByBlogs': title = '欅坂46' if result['group_id'] == 1 else '日向坂46'
                        else: title = ''
                        data = {
                            'status': 'success',
                            'type': 'url',
                            'title': title,
                            'num_of_hit': blogs.count(),
                            'group_id': result['group_id'],
                            'items': blogs_data,
                        }
                        return Response(data, status.HTTP_200_OK)
                    else: return Response({'status': 'not_found_blogs', 'type': 'url', 'message': 'not found blogs'}, status.HTTP_200_OK)
                else: return Response({'status': 'url_is_unjust', 'type': 'url', 'message': 'url is unjust'}, status.HTTP_200_OK)

            elif result['type'] == 'member':
                if result['class'] == 'appropriate':
                    members = otapick.search_members(result)
                    if members is not None:
                        members_data = self.serialize_members(members)

                        data = {
                            'status': 'success',
                            'type': 'member',
                            'num_of_hit': members.count(),
                            'items': members_data,
                        }
                        return Response(data, status.HTTP_200_OK)
                    else: return Response({'status': 'not_found_member', 'type': 'member', 'message': 'not found member'}, status.HTTP_200_OK)
                else: return Response({'status': 'text_is_unjust', 'type': 'member', 'message': 'url is unjust'}, status.HTTP_200_OK)
        else:
            return Response({'status': 'not_found_q', 'message': 'not found q params'}, status.HTTP_200_OK)

searchAPIView = SearchAPIView.as_view()


class SearchSuggestionsAPIView(SearchAPIView):
    query_set_length = 11
    # TODO
    # mobileの実装次第でquery_setの制限は実装しないかも。

    def serialize_blogs(self, blogs):
        ### query_setの制限 ###
        if len(blogs) > self.query_set_length:
            blogs = blogs[:self.query_set_length]
            blogs_data = BlogSerializerVerSS(blogs, many=True).data
            blogs_data.append(otapick.generate_watch_more('/search?q=' + urllib.parse.quote(self.q)))
        else:
            blogs_data = BlogSerializerVerSS(blogs, many=True).data
        ### query_setの制限 ###
        return blogs_data

    def serialize_members(self, members):
        ### query_setの制限 ###
        if len(members) > self.query_set_length:
            members = members[:self.query_set_length]
            members_data = MemberSerializerVerSS(members, many=True).data
            members_data.append(otapick.generate_watch_more('/search?q=' + urllib.parse.quote(self.q)))
        else:
            members_data = MemberSerializerVerSS(members, many=True).data
        ### query_setの制限 ###
        return members_data

searchSuggestionsAPIView = SearchSuggestionsAPIView.as_view()


class SearchSuggestionsInitAPIView(views.APIView):
    num_of_get = 5

    def get(self, request, *args, **kwargs):
        group_id = self.request.GET.get('group')
        group_id = int(group_id) if group_id == '1' or group_id == '2' else None

        blogs = Blog.objects.all() if group_id is None else Blog.objects.filter(writer__belonging_group__group_id=group_id)
        blogs = otapick.sort_blogs(blogs, 'popularity')[:self.num_of_get]
        blogs_data = BlogSerializerVerSS(blogs, many=True).data
        blogs_data.append(otapick.generate_watch_more('/blogs/1') if group_id == 1 else otapick.generate_watch_more('/blogs/2'))

        members = Member.objects.filter(temporary=False) if group_id is None else Member.objects.filter(belonging_group_id=group_id, temporary=False)
        members = members.order_by('?')[:self.num_of_get]
        members_data = MemberSerializerVerSS(members, many=True).data
        members_data.append(otapick.generate_watch_more('/members'))

        return Response({'blogs': blogs_data, 'members': members_data}, status.HTTP_200_OK)


searchSuggestionsInitAPIView = SearchSuggestionsInitAPIView.as_view()


