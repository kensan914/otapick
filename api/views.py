import os
import time
import urllib.parse
import zipfile
from django.http import FileResponse, HttpResponse
from rest_framework import status, views
from rest_framework.response import Response
import otapick.db.scores.controller
from api.serializers import *
from image.models import Progress
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
    def accept_image_download(self, group_id, blog_ct, blog):
        # for graduate member
        if blog.writer.graduate:
            blog_data = BlogSerializerVerDetail(blog).data
            blog_data.update({'status': 'get_image_failed', 'message': 'get image failed'})
            return Response(blog_data, status.HTTP_200_OK)

        data, status_code = otapick.accept_image_download(group_id, blog_ct)
        blog_data = BlogSerializerVerDetail(blog).data
        data.update(blog_data)
        return Response(data, status_code)

    def get(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct).exists():
            blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
            if Progress.objects.filter(target=blog).exists():
                progress = Progress.objects.get(target=blog)
                if progress.num == 100 and progress.ready:
                    blog_data = BlogSerializerVerDetail(blog).data
                    images = Image.objects.filter(publisher=blog).order_by('order')
                    blog_data['images'] = ImageSerializer(images, many=True).data
                    blog_data['status'] = 'success'
                    blog_data['VIEW_KEY'] = otapick.VIEW_KEY
                    blog_data['DOWNLOAD_KEY'] = otapick.DOWNLOAD_KEY
                    return Response(blog_data, status.HTTP_200_OK)
                else: return self.accept_image_download(group_id, blog_ct, blog)
            else: return self.accept_image_download(group_id, blog_ct, blog)
        else:
            # blogが見つからないたびにget_blogコマンドを実行していた。使わない方向で。
            # data, status_code = otapick.accept_blog_download(group_id, blog_ct)
            # if data['status'] != 'blog_not_found':
            #     return self.accept_image_download(group_id, blog_ct, Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct))
            return Response({'status': 'blog_not_found', 'message': 'blog not found'}, status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')

        # inform of blog view
        if 'action' in request.data and request.data['action'] == 'view':
            if 'key' in request.data and request.data['key'] == otapick.VIEW_KEY:
                if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct):
                    blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
                    otapick.increment_num_of_views(blog=blog, num=1)
                    return Response({'status': 'success'}, status.HTTP_200_OK)
                else: return Response({'status': 'blog_not_found'}, status.HTTP_200_OK)
            else: return Response({'status': 'unjust_key'}, status.HTTP_200_OK)

        # inform of image download for mobile
        elif 'action' in request.data and request.data['action'] == 'download' and 'image_order' in request.data:
            if 'key' in request.data and request.data['key'] == otapick.DOWNLOAD_KEY:
                if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct):
                    blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
                    if Image.objects.filter(publisher=blog, order=request.data['image_order']).exists():
                        image = Image.objects.filter(publisher=blog, order=request.data['image_order'])
                        otapick.increment_num_of_downloads(image, blog, num=1)
                        otapick.edit_num_of_most_downloads(blog)
                        return Response({'status': 'success'}, status.HTTP_200_OK)
                    else: return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
                else: return Response({'status': 'blog_not_found'}, status.HTTP_200_OK)
            else: return Response({'status': 'unjust_key'}, status.HTTP_200_OK)
        else: return Response({'status': 'failed'}, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        order_list = request.data # [0, 2, 3]

        try:
            if len(order_list) <= 0:
                return Response({'status': 'data_error'}, status.HTTP_200_OK)

            if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct):
                blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
                if Image.objects.filter(publisher=blog, order__in=order_list).exists():
                    images = Image.objects.filter(publisher=blog, order__in=order_list)

                    # rewrite num_of_downloads
                    otapick.increment_num_of_downloads(images, blog, num=1)
                    otapick.edit_num_of_most_downloads(blog)

                    if len(images) == 1:
                        return FileResponse(images[0].picture, as_attachment=True)
                    else:
                        response = HttpResponse(content_type='application/zip')
                        file_zip = zipfile.ZipFile(response, 'w')
                        for upload_image in images:
                            file_zip.writestr(os.path.basename(upload_image.picture.name), upload_image.picture.read())

                        zip_name = 'otapick_' + str(group_id) + '_' + str(blog_ct) + '.zip'
                        response['Content-Disposition'] = 'attachment; filename="{}"'.format(zip_name)
                        return response
                else: return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
            else: return Response({'status': 'blog_not_found'}, status.HTTP_200_OK)
        except: return Response({'status': 'failed'}, status.HTTP_200_OK)

blogDetailAPIView = BlogDetailAPIView.as_view()


class BlogListAPIView(views.APIView):
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(self.kwargs.get('group_id'), self.kwargs.get('ct'))
        order_format = self.request.GET.get('sort')
        narrowing_keyword = self.request.GET.get('keyword')
        narrowing_post = self.request.GET.get('post')
        page = int(self.request.GET.get('page')) if self.request.GET.get('page') is not None else 1
        random_seed = int(self.request.GET.get('random_seed')) if self.request.GET.get('random_seed') is not None else 0

        if group_id is not None:
            blogs = \
                Blog.objects.filter(writer__belonging_group__group_id=group_id) if ct is None \
                else Blog.objects.filter(writer__belonging_group__group_id=group_id, writer__ct=ct)
            blogs = otapick.sort_blogs(blogs, order_format)
            blogs = otapick.narrowdown_blogs_keyword(blogs, narrowing_keyword)
            blogs = otapick.narrowdown_blogs_post(blogs, narrowing_post)
            # to create id_list will be faster
            id_list = list(blogs[self.paginate_by * (page - 1): self.paginate_by * page].values_list('id', flat=True))
            blogs = [blogs.get(id=pk) for pk in id_list]

        # recommend
        else:
            blog_ids = Image.objects.filter(order=0).values_list('publisher__id', flat=True)
            blogs = Blog.objects.filter(id__in=blog_ids)
            blogs_id_list = otapick.sort_by_recommend_score(blogs, page, random_seed, self.paginate_by)
            blogs = [blogs.get(id=pk) for pk in blogs_id_list]

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


class ImageDetailAPIView(views.APIView):
    def put(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        order = self.kwargs.get('order')

        # inform of blog view
        if 'action' in request.data and request.data['action'] == 'view':
            if 'key' in request.data and request.data['key'] == otapick.VIEW_KEY:
                if Image.objects.filter(publisher__writer__belonging_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order).exists():
                    image = Image.objects.get(publisher__writer__belonging_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order)
                    otapick.increment_num_of_views(image=image, num=1)
                    return Response({'status': 'success'}, status.HTTP_200_OK)
                else: return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
            else: return Response({'status': 'unjust_key'}, status.HTTP_200_OK)

        # inform of image download for mobile
        elif 'action' in request.data and request.data['action'] == 'download':
            if 'key' in request.data and request.data['key'] == otapick.DOWNLOAD_KEY:
                if Image.objects.filter(publisher__writer__belonging_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order).exists():
                    image = Image.objects.get(publisher__writer__belonging_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order)
                    otapick.increment_num_of_downloads(image, image.publisher, num=1)
                    otapick.edit_num_of_most_downloads(image.publisher)
                    return Response({'status': 'success'}, status.HTTP_200_OK)
                else: return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
            else: return Response({'status': 'unjust_key'}, status.HTTP_200_OK)
        else: return Response({'status': 'failed'}, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        order = self.kwargs.get('order')

        try:
            if Image.objects.filter(publisher__writer__belonging_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order).exists():
                image = Image.objects.get(publisher__writer__belonging_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order)
                # rewrite num_of_downloads
                otapick.increment_num_of_downloads(image, image.publisher, num=1)
                otapick.edit_num_of_most_downloads(image.publisher)
                return FileResponse(image.picture, as_attachment=True)
            else: return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
        except: return Response({'status': 'failed'}, status.HTTP_200_OK)

imageDetailAPIView = ImageDetailAPIView.as_view()


class ImageListAPIView(views.APIView):
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(self.kwargs.get('group_id'), self.kwargs.get('ct'))
        page = int(self.request.GET.get('page')) if self.request.GET.get('page') is not None else 1
        random_seed = int(self.request.GET.get('random_seed')) if self.request.GET.get('random_seed') is not None else 0
        order_format = self.request.GET.get('sort')

        # filter
        if group_id is not None:
            images = \
                Image.objects.filter(publisher__writer__belonging_group__group_id=group_id) if ct is None \
                else Image.objects.filter(publisher__writer__belonging_group__group_id=group_id, publisher__writer__ct=ct)
            if not images.exists():
                return Response({'status': 'image_not_found'}, status.HTTP_200_OK)

        # recommend
        else:
            images = Image.objects.all()

        # sort and slice
        # result = otapick.sort_images(images, order_format)
        result = otapick.sort_images(images, order_format, self.paginate_by, page)

        # success sorted
        if result is not None:
            # sorted_images = result
            # # to create id_list will be faster
            # sorted_images = sorted_images[self.paginate_by * (page - 1): self.paginate_by * page]
            # id_list = list(sorted_images.values_list('id', flat=True))
            # images = [images.get(id=pk) for pk in id_list]

            images = result

        # hove to sort by recommend
        else:
            images_id_list = otapick.sort_by_recommend_score(images, page, random_seed, self.paginate_by)
            images = [images.get(id=pk) for pk in images_id_list]

        return Response(otapick.generate_images_data(images), status.HTTP_200_OK)

imageListAPIView = ImageListAPIView.as_view()


class ImageListInfoAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(self.kwargs.get('group_id'), self.kwargs.get('ct'))
        order_format = self.request.GET.get('sort')
        return Response(otapick.ImageListInfo(group_id, ct, order_format).get_result(), status.HTTP_200_OK)

imageListInfoAPIView = ImageListInfoAPIView.as_view()


class RelatedImageListAPIView(ImageListAPIView):
    def get(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        order = self.kwargs.get('order')
        page = int(self.request.GET.get('page')) if self.request.GET.get('page') is not None else 1

        blogs = Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
        if blogs.exists() and Image.objects.filter(publisher=blogs[0], order=order).exists():
            images_id_list = otapick.sort_images_by_related(blogs[0], order, page, self.paginate_by)
            images = [Image.objects.get(id=pk) for pk in images_id_list]
            return Response(otapick.generate_images_data(images), status.HTTP_200_OK)
        else:
            return Response({'status': 'image_not_found'}, status.HTTP_200_OK)

relatedImageListAPIView = RelatedImageListAPIView.as_view()


class HomeAPIView(ImageListAPIView):
    def get(self, request, *args, **kwargs):
        random_seed = int(self.request.GET.get('random_seed')) if self.request.GET.get('random_seed') is not None else 0
        page = int(self.request.GET.get('page')) if self.request.GET.get('page') is not None else 1

        images = Image.objects.all()
        images_id_list = otapick.sort_by_recommend_score(images, page, random_seed, self.paginate_by)
        images = [images.get(id=pk) for pk in images_id_list]

        return Response(otapick.generate_images_data(images), status.HTTP_200_OK)

homeAPIView = HomeAPIView.as_view()


class HomeAdditionalAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        random_seed = int(self.request.GET.get('random_seed')) if self.request.GET.get('random_seed') is not None else 0
        return Response(otapick.get_additional_data(random_seed), status.HTTP_200_OK)

homeAdditionalAPIView = HomeAdditionalAPIView.as_view()


class SearchAPIView(views.APIView):
    paginate_by = 20
    q = ''

    def serialize_blogs(self, blogs):
        return BlogSerializer(blogs, many=True).data

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
        if group_id == 1:
            blogs_data.append(otapick.generate_watch_more('/blogs/1'))
        elif group_id == 2:
            blogs_data.append(otapick.generate_watch_more('/blogs/2'))
        else:
            blogs_data.append(otapick.generate_watch_more('/blogs/'))

        members = Member.objects.filter(temporary=False) if group_id is None else Member.objects.filter(belonging_group_id=group_id, temporary=False)
        members = members.order_by('?')[:self.num_of_get]
        members_data = MemberSerializerVerSS(members, many=True).data
        members_data.append(otapick.generate_watch_more('/members'))

        return Response({'blogs': blogs_data, 'members': members_data}, status.HTTP_200_OK)


searchSuggestionsInitAPIView = SearchSuggestionsInitAPIView.as_view()
