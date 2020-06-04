from django.shortcuts import get_object_or_404
from rest_framework import status, views
from rest_framework.response import Response
from api.serializers import *
from main.models import Member, Blog
import otapick


class MemberRetrieveAPIView(views.APIView):
    def get(self, request, group_id, ct, *args, **kwargs):
        member = get_object_or_404(Member, belonging_group__group_id=group_id, ct=ct)
        serializer = MemberSerializer(instance=member)
        return Response(serializer.data, status.HTTP_200_OK)

memberRetrieveAPIView = MemberRetrieveAPIView.as_view()


class MemberListAPIView(views.APIView):
    def get(self, request, group_id, *args, **kwargs):
        members = Member.objects.filter(belonging_group__group_id=group_id)
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

memberListAPIView = MemberListAPIView.as_view()


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


class SearchSuggestionsAPIView(views.APIView):
    paginate_by = 20
    query_set_length = 11

    # TODO
    # mobileの実装次第でquery_setの制限は実装しないかも。

    def get(self, request, *args, **kwargs):
        q = self.request.GET.get('q')
        if q:
            result = otapick.parse_q(q)
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

                        ### query_setの制限 ###
                        if len(blogs) > self.query_set_length:
                            blogs = blogs[:self.query_set_length]
                            blogs_data = BlogSerializerVerSS(blogs, many=True).data
                            blogs_data.append(otapick.generate_watch_more('/react/search?q=' + q))
                        else:
                            blogs_data = BlogSerializerVerSS(blogs, many=True).data
                        ### query_setの制限 ###

                        return Response({'status': 'success', 'type': 'url', 'items': blogs_data}, status.HTTP_200_OK)
                    else: return Response({'status': 'not_found_blogs', 'type': 'url', 'message': 'not found blogs'}, status.HTTP_200_OK)
                else: return Response({'status': 'url_is_unjust', 'type': 'url', 'message': 'url is unjust'}, status.HTTP_200_OK)

            elif result['type'] == 'member':
                if result['class'] == 'appropriate':
                    members = otapick.search_members(result)
                    if members is not None:

                        ### query_setの制限 ###
                        if len(members) > self.query_set_length:
                            members = members[:self.query_set_length]
                            members_data = MemberSerializerVerSS(members, many=True).data
                            members_data.append(otapick.generate_watch_more('/react/search?q=' + q))
                        else:
                            members_data = MemberSerializerVerSS(members, many=True).data
                        ### query_setの制限 ###

                        return Response({'status': 'success', 'type': 'member', 'items': members_data}, status.HTTP_200_OK)
                    else: return Response({'status': 'not_found_member', 'type': 'member', 'message': 'not found member'}, status.HTTP_200_OK)
                else: return Response({'status': 'text_is_unjust', 'type': 'member', 'message': 'url is unjust'}, status.HTTP_200_OK)
        else:
            return Response({'status': 'not_found_q', 'message': 'not found q params'}, status.HTTP_200_OK)

    # def reduce_(self, result):



searchSuggestionsAPIView = SearchSuggestionsAPIView.as_view()


class SearchSuggestionsInitAPIView(views.APIView):
    num_of_get = 5

    def get(self, request, *args, **kwargs):
        group_id = self.request.GET.get('group')
        group_id = int(group_id) if group_id == '1' or group_id == '2' else None

        blogs = Blog.objects.all() if group_id is None else Blog.objects.filter(writer__belonging_group__group_id=group_id)
        blogs = otapick.sort_blogs(blogs, 'popularity')[:self.num_of_get]
        blogs_data = BlogSerializerVerSS(blogs, many=True).data
        blogs_data.append(otapick.generate_watch_more('/react/blogs/1') if group_id == 1 else otapick.generate_watch_more('/react/blogs/2'))

        members = Member.objects.filter(temporary=False) if group_id is None else Member.objects.filter(belonging_group_id=group_id, temporary=False)
        members = members.order_by('?')[:self.num_of_get]
        members_data = MemberSerializerVerSS(members, many=True).data
        members_data.append(otapick.generate_watch_more('/react/members'))

        return Response({'blogs': blogs_data, 'members': members_data}, status.HTTP_200_OK)


searchSuggestionsInitAPIView = SearchSuggestionsInitAPIView.as_view()
