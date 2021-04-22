import os
import urllib.parse
import zipfile
from django.http import FileResponse, HttpResponse
from rest_framework import status, views, permissions
from rest_framework.response import Response
import otapick.db.scores.controller
from api.serializers import *
from image.models import Favorite
from main.models import Member, Blog, Group
from account.models import MAX_FAVORITE_IMAGES_NUM_UNLIMITED_SIGN
import otapick


# {'sakura': [[1期生], [2期生]], 'hinata': [[1期生], [2期生], [3期生]]} ☚今後、メンバーが増えてもこのクラスをいじる必要はない
class MemberListAPIView(views.APIView):
    # generate member list separated by its generation.
    def generate_member_list(self, members):
        member_dict = {}  # key is its generation.
        for member in members:
            if not str(member.generation) in member_dict:
                member_dict[str(member.generation)] = []
            member_dict[str(member.generation)].append(member)
        # [('1', [<石森>, <今泉>,...]), ('2', [<井上>, <遠藤>,...])]
        sorted_members = sorted(member_dict.items())
        # [[<石森>, <今泉>,...], [<井上>, <遠藤>,...]]
        member_list = [member_tuple[1] for member_tuple in sorted_members]
        return member_list

    def get(self, request, *args, **kwargs):
        data = {}
        for group in Group.objects.filter(is_active=True):
            members_by_group = Member.objects.filter(
                belonging_group=group).exclude(generation=0)
            member_list_by_group = self.generate_member_list(members_by_group)
            for i, target in enumerate(member_list_by_group):
                member_list_by_group[i] = MemberSerializer(
                    target, many=True).data
            data[group.key] = member_list_by_group

        return Response(data, status.HTTP_200_OK)


memberListAPIView = MemberListAPIView.as_view()


class BlogDetailAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        blogs = Blog.objects.filter(
            publishing_group__group_id=group_id, blog_ct=blog_ct)
        if blogs.exists():
            blog = blogs.first()
            blog_data = BlogSerializerVerDetail(
                blog, context={'me': request.user}).data
            blog_data['status'] = 'success'
            return Response(blog_data, status.HTTP_200_OK)
        else:
            return Response({'status': 'blog_not_found', 'message': 'blog not found'}, status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')

        # inform of blog view
        if 'action' in request.data and request.data['action'] == 'view':
            if 'key' in request.data and request.data['key'] == otapick.VIEW_KEY:
                blogs = Blog.objects.filter(
                    publishing_group__group_id=group_id, blog_ct=blog_ct)
                if blogs.exists():
                    blog = blogs.first()
                    otapick.increment_num_of_views(blog=blog, num=1)
                    return Response({'status': 'success'}, status.HTTP_200_OK)
                else:
                    return Response({'status': 'blog_not_found'}, status.HTTP_200_OK)
            else:
                return Response({'status': 'unjust_key'}, status.HTTP_200_OK)

        # inform of image download for mobile
        elif 'action' in request.data and request.data['action'] == 'download' and 'image_order' in request.data:
            if 'key' in request.data and request.data['key'] == otapick.DOWNLOAD_KEY:
                blogs = Blog.objects.filter(
                    publishing_group__group_id=group_id, blog_ct=blog_ct)
                if blogs.exists():
                    blog = blogs.first()
                    images = Image.objects.filter(
                        publisher=blog, order=request.data['image_order'])
                    if images.exists():
                        image = images.first()
                        otapick.increment_num_of_downloads(image, blog, num=1)
                        otapick.edit_num_of_most_downloads(blog)
                        return Response({'status': 'success'}, status.HTTP_200_OK)
                    else:
                        return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
                else:
                    return Response({'status': 'blog_not_found'}, status.HTTP_200_OK)
            else:
                return Response({'status': 'unjust_key'}, status.HTTP_200_OK)
        else:
            return Response({'status': 'failed'}, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        order_list = request.data  # [0, 2, 3]

        try:
            if len(order_list) <= 0:
                return Response({'status': 'data_error'}, status.HTTP_200_OK)

            blogs = Blog.objects.filter(
                publishing_group__group_id=group_id, blog_ct=blog_ct)
            if blogs.exists():
                blog = blogs.first()
                if Image.objects.filter(publisher=blog, order__in=order_list).exists():
                    images = Image.objects.filter(
                        publisher=blog, order__in=order_list)

                    # rewrite num_of_downloads
                    otapick.increment_num_of_downloads(images, blog, num=1)
                    otapick.edit_num_of_most_downloads(blog)

                    if len(images) == 1:
                        return FileResponse(images[0].picture, as_attachment=True)
                    else:
                        response = HttpResponse(content_type='application/zip')
                        file_zip = zipfile.ZipFile(response, 'w')
                        for upload_image in images:
                            file_zip.writestr(os.path.basename(
                                upload_image.picture.name), upload_image.picture.read())

                        zip_name = 'otapick_' + \
                            str(group_id) + '_' + str(blog_ct) + '.zip'
                        response['Content-Disposition'] = 'attachment; filename="{}"'.format(
                            zip_name)
                        return response
                else:
                    return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
            else:
                return Response({'status': 'blog_not_found'}, status.HTTP_200_OK)
        except:
            return Response({'status': 'failed'}, status.HTTP_200_OK)


blogDetailAPIView = BlogDetailAPIView.as_view()


class BlogListAPIView(views.APIView):
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(
            self.kwargs.get('group_id'), self.kwargs.get('ct'))
        order_format = self.request.GET.get('sort')
        narrowing_keyword = self.request.GET.get('keyword')
        narrowing_post = self.request.GET.get('post')
        _page = self.request.GET.get('page')
        page = int(_page) if _page is not None and _page.isdecimal() else 1
        # + random_seed, groups 効率のためrecommend処理内でget

        if group_id is not None:
            if ct is None:
                blogs = Blog.objects.filter(
                    publishing_group__group_id=group_id)
            else:
                if Group.objects.filter(is_active=True, group_id=group_id).exists():
                    blogs = Blog.objects.filter(
                        writer__belonging_group__group_id=group_id, writer__ct=ct)
                else:  # ex) blogs/3/01/ ☚メンバー絞込みでis_active=Falseのグループを指定することはできない
                    return Response({'status': 'failed'}, status.HTTP_404_NOT_FOUND)

            blogs = otapick.sort_blogs(blogs, order_format)
            blogs = otapick.narrowdown_blogs_keyword(blogs, narrowing_keyword)
            blogs = otapick.narrowdown_blogs_post(blogs, narrowing_post)
            # to create id_list will be faster
            id_list = list(blogs[self.paginate_by * (page - 1): self.paginate_by * page].values_list('id', flat=True))
            blogs = [blogs.get(id=pk) for pk in id_list]

        # recommend
        else:
            # [random_seed, groups] q paramsはrecommendの時のみ有効
            random_seed_str = self.request.GET.get('random_seed', '0')
            random_seed = int(
                random_seed_str) if random_seed_str.isdecimal() else 0
            groups_str = self.request.GET.get('groups', '')  # ex) '1,2,   3'
            groups = otapick.convert_querystring_to_list(
                groups_str)  # ex) [1, 2, 3]

            base_images = otapick.get_filtered_images_group_ids(groups)

            blog_ids = base_images.filter(
                order=0).values_list('publisher__id', flat=True)
            blogs = Blog.objects.filter(id__in=blog_ids)
            blogs_id_list = otapick.sort_by_recommend_score(
                blogs, page, random_seed, self.paginate_by)
            blogs = [blogs.get(id=pk) for pk in blogs_id_list]

        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


blogListAPIView = BlogListAPIView.as_view()


class BlogListInfoAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(
            self.kwargs.get('group_id'), self.kwargs.get('ct'))
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
                images = Image.objects.filter(
                    publisher__publishing_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order)
                if images.exists():
                    image = images.first()
                    otapick.increment_num_of_views(image=image, num=1)
                    return Response({'status': 'success'}, status.HTTP_200_OK)
                else:
                    return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
            else:
                return Response({'status': 'unjust_key'}, status.HTTP_200_OK)

        # inform of image download for mobile
        elif 'action' in request.data and request.data['action'] == 'download':
            if 'key' in request.data and request.data['key'] == otapick.DOWNLOAD_KEY:
                images = Image.objects.filter(
                    publisher__publishing_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order)
                if images.exists():
                    image = images.first()
                    otapick.increment_num_of_downloads(
                        image, image.publisher, num=1)
                    otapick.edit_num_of_most_downloads(image.publisher)
                    return Response({'status': 'success'}, status.HTTP_200_OK)
                else:
                    return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
            else:
                return Response({'status': 'unjust_key'}, status.HTTP_200_OK)
        else:
            return Response({'status': 'failed'}, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        order = self.kwargs.get('order')

        try:
            images = Image.objects.filter(
                publisher__publishing_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order)
            if images.exists():
                image = images.first()
                # rewrite num_of_downloads
                otapick.increment_num_of_downloads(
                    image, image.publisher, num=1)
                otapick.edit_num_of_most_downloads(image.publisher)
                return FileResponse(image.picture, as_attachment=True)
            else:
                return Response({'status': 'image_not_found'}, status.HTTP_200_OK)
        except:
            return Response({'status': 'failed'}, status.HTTP_200_OK)


imageDetailAPIView = ImageDetailAPIView.as_view()


class ImageListAPIView(views.APIView):
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(
            self.kwargs.get('group_id'), self.kwargs.get('ct'))
        _page = self.request.GET.get('page')
        page = int(_page) if _page is not None and _page.isdecimal() else 1
        random_seed_str = self.request.GET.get('random_seed', '0')
        random_seed = int(
            random_seed_str) if random_seed_str.isdecimal() else 0
        order_format = self.request.GET.get('sort', '')
        # + groups 効率のためrecommend処理内でget

        # filter
        if group_id is not None:
            if ct is None:
                images = Image.objects.filter(
                    publisher__publishing_group__group_id=group_id)
            else:
                if Group.objects.filter(is_active=True, group_id=group_id).exists():
                    images = Image.objects.filter(
                        publisher__writer__belonging_group__group_id=group_id, publisher__writer__ct=ct)
                else:  # ex) images/3/01/ ☚メンバー絞込みでis_active=Falseのグループを指定することはできない
                    return Response({'status': 'failed'}, status.HTTP_404_NOT_FOUND)
            if not images.exists():
                return Response({'status': 'image_not_found'}, status.HTTP_200_OK)

        # recommend
        else:
            # groups query parameterはrecommendの時のみ有効
            groups_str = self.request.GET.get('groups', '')  # ex) '1,2,   3'
            groups = otapick.convert_querystring_to_list(
                groups_str)  # ex) [1, 2, 3]

            images = otapick.get_filtered_images_group_ids(groups)

        # sort and slice
        result = otapick.sort_images(images, order_format)

        # success sorted
        if result is not None:
            sorted_images = result
            # to create id_list will be faster
            sorted_images = sorted_images[self.paginate_by *
                                          (page - 1): self.paginate_by * page]
            id_list = list(sorted_images.values_list('id', flat=True))
            images = [images.get(id=pk) for pk in id_list]

        # hove to sort by recommend
        else:
            images_id_list = otapick.sort_by_recommend_score(
                images, page, random_seed, self.paginate_by)
            images = [images.get(id=pk) for pk in images_id_list]

        return Response(otapick.generate_images_data(images, request), status.HTTP_200_OK)


imageListAPIView = ImageListAPIView.as_view()


class ImageListInfoAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(
            self.kwargs.get('group_id'), self.kwargs.get('ct'))
        order_format = self.request.GET.get('sort')
        return Response(otapick.ImageListInfo(group_id, ct, order_format).get_result(), status.HTTP_200_OK)


imageListInfoAPIView = ImageListInfoAPIView.as_view()


class RelatedImageListAPIView(ImageListAPIView):
    def get(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        order = self.kwargs.get('order')
        _page = self.request.GET.get('page')
        page = int(_page) if _page is not None and _page.isdecimal() else 1

        blogs = Blog.objects.filter(
            publishing_group__group_id=group_id, blog_ct=blog_ct)
        if blogs.exists() and Image.objects.filter(publisher=blogs.first(), order=order).exists():
            images_id_list = otapick.sort_images_by_related(
                blogs.first(), order, page, self.paginate_by)
            images = [Image.objects.get(id=pk) for pk in images_id_list]
            return Response(otapick.generate_images_data(images, request), status.HTTP_200_OK)
        else:
            return Response({'status': 'image_not_found'}, status.HTTP_200_OK)


relatedImageListAPIView = RelatedImageListAPIView.as_view()


class HomeAPIView(ImageListAPIView):
    def get(self, request, *args, **kwargs):
        random_seed_str = self.request.GET.get('random_seed', '0')
        random_seed = int(
            random_seed_str) if random_seed_str.isdecimal() else 0
        page_str = self.request.GET.get('page', '1')
        page = int(page_str) if page_str.isdecimal() else 1
        groups_str = self.request.GET.get('groups', '')  # ex) '1,2,   3'
        groups = otapick.convert_querystring_to_list(
            groups_str)  # ex) [1, 2, 3]

        images = otapick.get_filtered_images_group_ids(groups)

        images_id_list = otapick.sort_by_recommend_score(
            images, page, random_seed, self.paginate_by)
        images = [images.get(id=pk) for pk in images_id_list]

        return Response(otapick.generate_images_data(images, request), status.HTTP_200_OK)


homeAPIView = HomeAPIView.as_view()


class HomeAdditionalAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        random_seed_str = self.request.GET.get('random_seed', '0')
        random_seed = int(
            random_seed_str) if random_seed_str.isdecimal() else 0
        groups_str = self.request.GET.get('groups', '')  # ex) '1,2,   3'
        groups = otapick.convert_querystring_to_list(
            groups_str)  # ex) [1, 2, 3]

        return Response(otapick.get_additional_data(
            random_seed, request, filter_group_ids=groups), status.HTTP_200_OK)


homeAdditionalAPIView = HomeAdditionalAPIView.as_view()


class SearchAPIView(views.APIView):
    q = ''
    is_mobile = False  # mobileクエリパラメータが↓IS_MOBILE_EVALUATION_SIGNと一致するか
    IS_MOBILE_EVALUATION_SIGN = "true"

    def serialize_blogs(self, blogs):
        return BlogSerializer(blogs, many=True).data

    def serialize_members(self, members):
        return MemberSerializer(members, many=True).data

    def get(self, request, *args, **kwargs):
        self.q = self.request.GET.get('q')
        self.is_mobile = self.request.GET.get(
            'mobile') == self.IS_MOBILE_EVALUATION_SIGN

        if self.q:
            result = otapick.parse_q(self.q, self.is_mobile)
            if result['type'] == 'url':
                if result['class'] != 'unjust':
                    blogs = otapick.search_blogs(result)
                    if blogs is not None:
                        paginate_by = result['blog_list_paginate_by']
                        blogs = blogs[paginate_by *
                                      (result['page'] - 1): paginate_by * result['page']]
                        blogs_data = self.serialize_blogs(blogs)

                        all_groups = Group.objects.all()
                        if result['class'] == 'searchByLatest':
                            title = ''
                            for group in all_groups:
                                if result['group_id'] == group.group_id:
                                    title = '{} 最新ブログ'.format(group.name)
                        elif result['class'] == 'searchByMembers':
                            try:
                                title = Member.objects.get(
                                    belonging_group__group_id=result['group_id'], ct=result['ct']).full_kanji
                            except:
                                title = ''
                        elif result['class'] == 'searchByBlogs':
                            title = ''
                            for group in all_groups:
                                if result['group_id'] == group.group_id:
                                    title = group.name
                        else:
                            title = ''
                        data = {
                            'status': 'success',
                            'type': 'url',
                            'title': title,
                            'num_of_hit': blogs.count(),
                            'group_id': result['group_id'],
                            'items': blogs_data,
                        }
                        return Response(data, status.HTTP_200_OK)
                    else:
                        return Response({'status': 'not_found_blogs', 'type': 'url', 'message': 'not found blogs'}, status.HTTP_200_OK)
                else:
                    return Response({'status': 'url_is_unjust', 'type': 'url', 'message': 'url is unjust'}, status.HTTP_200_OK)

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
                    else:
                        return Response({'status': 'not_found_member', 'type': 'member', 'message': 'not found member'}, status.HTTP_200_OK)
                else:
                    return Response({'status': 'text_is_unjust', 'type': 'member', 'message': 'url is unjust'}, status.HTTP_200_OK)
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
            blogs_data.append(otapick.generate_watch_more(
                '/search?q=' + urllib.parse.quote(self.q)))
        else:
            blogs_data = BlogSerializerVerSS(blogs, many=True).data
        ### query_setの制限 ###
        return blogs_data

    def serialize_members(self, members):
        ### query_setの制限 ###
        if len(members) > self.query_set_length:
            members = members[:self.query_set_length]
            members_data = MemberSerializerVerSS(members, many=True).data
            members_data.append(otapick.generate_watch_more(
                '/search?q=' + urllib.parse.quote(self.q)))
        else:
            members_data = MemberSerializerVerSS(members, many=True).data
        ### query_setの制限 ###
        return members_data


searchSuggestionsAPIView = SearchSuggestionsAPIView.as_view()


class SearchSuggestionsInitAPIView(views.APIView):
    num_of_get = 5

    def get(self, request, *args, **kwargs):
        groups_str = self.request.GET.get('groups', '')  # ex) '1,2,   3'
        groups = otapick.convert_querystring_to_list(
            groups_str)  # ex) [1, 2, 3]

        if groups and all([type(g) is int for g in groups]):
            base_blogs = Blog.objects.filter(
                publishing_group__group_id__in=groups)
            # この時点でbase_blogsが存在しない場合(ex. groups=12,23)
            if not base_blogs.exists():
                base_blogs = Blog.objects.all()

            # 3(欅)のみ指定の場合, 1(櫻)でfilter
            keyaki_groups = Group.objects.filter(key="keyaki")
            sakura_groups = Group.objects.filter(key="sakura")
            if keyaki_groups.exists() and sakura_groups.exists():
                keyaki_group = keyaki_groups.first()
                sakura_group = sakura_groups.first()
                if keyaki_group.group_id in groups:
                    groups = [sakura_group.id if group_id ==
                              keyaki_group.id else group_id for group_id in groups]
                base_members = Member.objects.filter(
                    belonging_group_id__in=groups, temporary=False)
            else:
                base_members = Member.objects.filter(temporary=False)

            # この時点でbase_membersが存在しない場合(ex. groups=12,23)
            if not base_members.exists():
                base_members = Member.objects.filter(temporary=False)
        else:
            base_blogs = Blog.objects.all()
            base_members = Member.objects.filter(temporary=False)

        # popularity_blogs
        popularity_blogs = otapick.sort_blogs(
            base_blogs, 'popularity')[:self.num_of_get]
        blogs_data = BlogSerializerVerSS(popularity_blogs, many=True).data
        blogs_data.append(otapick.generate_watch_more('/blogs/'))

        # rondom members
        rondom_members = base_members.order_by('?')[:self.num_of_get]
        members_data = MemberSerializerVerSS(rondom_members, many=True).data
        members_data.append(otapick.generate_watch_more('/members/'))

        return Response({'blogs': blogs_data, 'members': members_data}, status.HTTP_200_OK)


searchSuggestionsInitAPIView = SearchSuggestionsInitAPIView.as_view()


# imageテーブルとaccountテーブルの中間テーブル(favoriteテーブル)をリソースとして捉えた
class FavoriteAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_image(self, kwargs):
        group_id = kwargs.get('group_id')
        blog_ct = kwargs.get('blog_ct')
        order = kwargs.get('order')
        images = Image.objects.filter(
            publisher__publishing_group__group_id=group_id, publisher__blog_ct=blog_ct, order=order)
        if images.exists():
            return images.first()
        else:
            return

    def get_favorite(self, image, user):
        favorites = Favorite.objects.filter(image=image, user=user)
        if favorites.exists():
            return favorites.first()
        else:
            return

    # 中間テーブル(favoriteテーブル)を作成しているが、べき等性があるためput
    def put(self, request, *args, **kwargs):
        image = self.get_image(self.kwargs)
        if image is None:
            return Response({'status': 'not_found'}, status.HTTP_404_NOT_FOUND)

        favorites = Favorite.objects.filter(user=request.user)
        if request.user.max_favorite_images_num != MAX_FAVORITE_IMAGES_NUM_UNLIMITED_SIGN and request.user.max_favorite_images_num <= favorites.count():
            # max値を超えている
            return Response({'status': 'exceed_max_num'}, status.HTTP_409_CONFLICT)

        created_favorite = self.get_favorite(image, request.user)
        if created_favorite is None:
            Favorite.objects.create(
                image=image,
                user=request.user,
            )
        return Response({'status': 'success'}, status.HTTP_200_OK)

    # 中間テーブル(favoriteテーブル)を削除しているため
    def delete(self, request, *args, **kwargs):
        image = self.get_image(self.kwargs)
        if image is not None:
            favorite = self.get_favorite(image, request.user)
            if favorite is not None:
                favorite.delete()
            return Response(status.HTTP_204_NO_CONTENT)
        return Response({'status': 'not_found'}, status.HTTP_404_NOT_FOUND)


favoriteAPIView = FavoriteAPIView.as_view()


class FavoriteListAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        _page = self.request.GET.get('page')
        page = int(_page) if _page is not None and _page.isdecimal() else 1

        favorites = Favorite.objects.filter(user=request.user)
        favorites = favorites[self.paginate_by *
                              (page - 1): self.paginate_by * page]
        images = [favorite.image for favorite in favorites]
        return Response(otapick.generate_images_data(images, request), status.HTTP_200_OK)


favoriteListAPIView = FavoriteListAPIView.as_view()


class FavoriteListInfoAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        favorites = Favorite.objects.filter(user=request.user)

        return Response({
            'favorites_num': favorites.count(),
            'max_favorites_num': request.user.max_favorite_images_num if request.user else 0,
        }, status.HTTP_200_OK)


favoriteListInfoAPIView = FavoriteListInfoAPIView.as_view()
