from django.shortcuts import get_object_or_404
from rest_framework import status, views
from rest_framework.response import Response
from api.scripts import blogORMapper
from api.scripts.blogListInfo import BlogListInfo
from api.scripts.urlShaper import shapeCt
from api.serializers import MemberSerializer, BlogSerializer
from main.models import Member, Blog


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
        group_id, ct = shapeCt(self.kwargs.get('group_id'), self.kwargs.get('ct'))
        order_format = self.request.GET.get('sort')
        # narrowing_keyword = self.request.GET.get('keyword')
        # narrowing_post = self.request.GET.get('post')
        page = int(self.request.GET.get('page')) if self.request.GET.get('page') is not None else 1

        narrowing_blogs = \
            Blog.objects.filter(writer__belonging_group__group_id=group_id) if ct is None \
            else Blog.objects.filter(writer__belonging_group__group_id=group_id, writer__ct=ct)
        narrowing_blogs = blogORMapper.sort(narrowing_blogs, order_format)

        blogs = narrowing_blogs[self.paginate_by * ( page - 1 ): self.paginate_by * page]
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

blogListAPIView = BlogListAPIView.as_view()


class BlogListInfoAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id, ct = shapeCt(self.kwargs.get('group_id'), self.kwargs.get('ct'))
        order_format = self.request.GET.get('sort')

        return Response(BlogListInfo(group_id, ct, order_format).get_result(), status.HTTP_200_OK)


blogListInfoAPIView = BlogListInfoAPIView.as_view()
