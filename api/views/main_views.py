import os
import urllib.parse
import zipfile
from django.http import FileResponse, HttpResponse
from rest_framework import views, status
from rest_framework.response import Response
from api.models.image.models import Image
from api.models.main.models import Group, Member, Blog
from api.serializers.main_serializers import (
    MemberSerializer,
    BlogSerializerVerDetail,
    BlogSerializer,
    BlogSerializerVerSS,
    MemberSerializerVerSS,
)
from api.otapick.extensions.views_ex import (
    convert_querystring_to_list,
    sort_by_recommend_score,
    BlogListInfo,
)
from api import otapick


class MemberListAPIView(views.APIView):
    """
    {
        "sakura": { "1": [1期生], "2": [2期生] },
        "hinata": { "1": [1期生], "2": [2期生], "3": [3期生], "0": [その他メンバー] },
    } ☚今後、メンバーが増えてもこのクラスをいじる必要はない
    """

    # generate member list separated by its generation.
    def generate_member_collection(self, members):
        member_collection = {}  # key is its generation.
        for member in members:
            if not str(member.generation) in member_collection:
                member_collection[str(member.generation)] = []
            member_collection[str(member.generation)].append(member)
        return member_collection

    def get(self, request, *args, **kwargs):
        data = {}
        for group in Group.objects.filter(is_active=True):
            members_by_group = Member.objects.filter(belonging_group=group)
            member_collection_by_group = self.generate_member_collection(
                members_by_group
            )
            for gene, member_list_by_gene in member_collection_by_group.items():
                member_collection_by_group[gene] = MemberSerializer(
                    member_list_by_gene, many=True
                ).data
            data[group.key] = member_collection_by_group

        return Response(data, status.HTTP_200_OK)


memberListAPIView = MemberListAPIView.as_view()


class BlogDetailAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id = self.kwargs.get("group_id")
        blog_ct = self.kwargs.get("blog_ct")
        blogs = Blog.objects.filter(
            publishing_group__group_id=group_id, blog_ct=blog_ct
        )
        if blogs.exists():
            blog = blogs.first()
            blog_data = BlogSerializerVerDetail(blog, context={"me": request.user}).data
            blog_data["status"] = "success"
            return Response(blog_data, status.HTTP_200_OK)
        else:
            return Response(
                {"status": "blog_not_found", "message": "blog not found"},
                status.HTTP_200_OK,
            )

    def put(self, request, *args, **kwargs):
        group_id = self.kwargs.get("group_id")
        blog_ct = self.kwargs.get("blog_ct")

        # inform of blog view
        if "action" in request.data and request.data["action"] == "view":
            if "key" in request.data and request.data["key"] == otapick.VIEW_KEY:
                blogs = Blog.objects.filter(
                    publishing_group__group_id=group_id, blog_ct=blog_ct
                )
                if blogs.exists():
                    blog = blogs.first()
                    otapick.increment_num_of_views(blog=blog, num=1)
                    return Response({"status": "success"}, status.HTTP_200_OK)
                else:
                    return Response({"status": "blog_not_found"}, status.HTTP_200_OK)
            else:
                return Response({"status": "unjust_key"}, status.HTTP_200_OK)

        # inform of image download for mobile
        elif (
            "action" in request.data
            and request.data["action"] == "download"
            and "image_order" in request.data
        ):
            if "key" in request.data and request.data["key"] == otapick.DOWNLOAD_KEY:
                blogs = Blog.objects.filter(
                    publishing_group__group_id=group_id, blog_ct=blog_ct
                )
                if blogs.exists():
                    blog = blogs.first()
                    images = Image.objects.filter(
                        publisher=blog, order=request.data["image_order"]
                    )
                    if images.exists():
                        image = images.first()
                        otapick.increment_num_of_downloads(image, blog, num=1)
                        otapick.edit_num_of_most_downloads(blog)
                        return Response({"status": "success"}, status.HTTP_200_OK)
                    else:
                        return Response(
                            {"status": "image_not_found"}, status.HTTP_200_OK
                        )
                else:
                    return Response({"status": "blog_not_found"}, status.HTTP_200_OK)
            else:
                return Response({"status": "unjust_key"}, status.HTTP_200_OK)
        else:
            return Response({"status": "failed"}, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get("group_id")
        blog_ct = self.kwargs.get("blog_ct")
        order_list = request.data  # [0, 2, 3]

        try:
            if len(order_list) <= 0:
                return Response({"status": "data_error"}, status.HTTP_200_OK)

            blogs = Blog.objects.filter(
                publishing_group__group_id=group_id, blog_ct=blog_ct
            )
            if blogs.exists():
                blog = blogs.first()
                if Image.objects.filter(publisher=blog, order__in=order_list).exists():
                    images = Image.objects.filter(publisher=blog, order__in=order_list)

                    # rewrite num_of_downloads
                    otapick.increment_num_of_downloads(images, blog, num=1)
                    otapick.edit_num_of_most_downloads(blog)

                    if len(images) == 1:
                        return FileResponse(images[0].picture, as_attachment=True)
                    else:
                        response = HttpResponse(content_type="application/zip")
                        file_zip = zipfile.ZipFile(response, "w")
                        for upload_image in images:
                            file_zip.writestr(
                                os.path.basename(upload_image.picture.name),
                                upload_image.picture.read(),
                            )

                        zip_name = (
                            "otapick_" + str(group_id) + "_" + str(blog_ct) + ".zip"
                        )
                        response[
                            "Content-Disposition"
                        ] = 'attachment; filename="{}"'.format(zip_name)
                        return response
                else:
                    return Response({"status": "image_not_found"}, status.HTTP_200_OK)
            else:
                return Response({"status": "blog_not_found"}, status.HTTP_200_OK)
        except:
            return Response({"status": "failed"}, status.HTTP_200_OK)


blogDetailAPIView = BlogDetailAPIView.as_view()


class BlogListAPIView(views.APIView):
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(
            self.kwargs.get("group_id"), self.kwargs.get("ct")
        )
        order_format = self.request.GET.get("sort")
        narrowing_keyword = self.request.GET.get("keyword")
        narrowing_post = self.request.GET.get("post")
        _page = self.request.GET.get("page")
        page = int(_page) if _page is not None and _page.isdecimal() else 1
        # + random_seed, groups 効率のためrecommend処理内でget

        if group_id is not None:
            if ct is None:
                blogs = Blog.objects.filter(publishing_group__group_id=group_id)
            else:
                if Group.objects.filter(is_active=True, group_id=group_id).exists():
                    blogs = Blog.objects.filter(
                        writer__belonging_group__group_id=group_id, writer__ct=ct
                    )
                else:  # ex) blogs/3/01/ ☚メンバー絞込みでis_active=Falseのグループを指定することはできない
                    return Response({"status": "failed"}, status.HTTP_404_NOT_FOUND)

            blogs = otapick.sort_blogs(blogs, order_format)
            blogs = otapick.narrowdown_blogs_keyword(blogs, narrowing_keyword)
            blogs = otapick.narrowdown_blogs_post(blogs, narrowing_post)
            # to create id_list will be faster
            id_list = list(
                blogs[
                    self.paginate_by * (page - 1) : self.paginate_by * page
                ].values_list("id", flat=True)
            )
            blogs = [blogs.get(id=pk) for pk in id_list]

        # recommend
        else:
            # [random_seed, groups] q paramsはrecommendの時のみ有効
            random_seed_str = self.request.GET.get("random_seed", "0")
            random_seed = int(random_seed_str) if random_seed_str.isdecimal() else 0
            groups_str = self.request.GET.get("groups", "")  # ex) '1,2,   3'
            groups = convert_querystring_to_list(groups_str)  # ex) [1, 2, 3]

            base_images = otapick.get_filtered_images_group_ids(groups)

            blog_ids = base_images.filter(order=0).values_list(
                "publisher__id", flat=True
            )
            blogs = Blog.objects.filter(id__in=blog_ids)
            blogs_id_list = sort_by_recommend_score(
                blogs, page, random_seed, self.paginate_by
            )
            blogs = [blogs.get(id=pk) for pk in blogs_id_list]

        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


blogListAPIView = BlogListAPIView.as_view()


class BlogListInfoAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(
            self.kwargs.get("group_id"), self.kwargs.get("ct")
        )
        order_format = self.request.GET.get("sort")
        narrowing_keyword = self.request.GET.get("keyword")
        narrowing_post = self.request.GET.get("post")

        return Response(
            BlogListInfo(
                group_id, ct, order_format, narrowing_keyword, narrowing_post
            ).get_result(),
            status.HTTP_200_OK,
        )


blogListInfoAPIView = BlogListInfoAPIView.as_view()


class SearchAPIView(views.APIView):
    q = ""
    is_mobile = False  # mobileクエリパラメータが↓IS_MOBILE_EVALUATION_SIGNと一致するか
    IS_MOBILE_EVALUATION_SIGN = "true"

    def serialize_blogs(self, blogs):
        return BlogSerializer(blogs, many=True).data

    def serialize_members(self, members):
        return MemberSerializer(members, many=True).data

    def get(self, request, *args, **kwargs):
        self.q = self.request.GET.get("q")
        self.is_mobile = (
            self.request.GET.get("mobile") == self.IS_MOBILE_EVALUATION_SIGN
        )

        if self.q:
            result = otapick.parse_q(self.q, self.is_mobile)
            if result["type"] == "url":
                if result["class"] != "unjust":
                    blogs = otapick.search_blogs(result)
                    if blogs is not None:
                        paginate_by = result["blog_list_paginate_by"]
                        blogs = blogs[
                            paginate_by
                            * (result["page"] - 1) : paginate_by
                            * result["page"]
                        ]
                        blogs_data = self.serialize_blogs(blogs)

                        all_groups = Group.objects.all()
                        if result["class"] == "searchByLatest":
                            title = ""
                            for group in all_groups:
                                if result["group_id"] == group.group_id:
                                    title = "{} 最新ブログ".format(group.name)
                        elif result["class"] == "searchByMembers":
                            try:
                                title = Member.objects.get(
                                    belonging_group__group_id=result["group_id"],
                                    ct=result["ct"],
                                ).full_kanji
                            except:
                                title = ""
                        elif result["class"] == "searchByBlogs":
                            title = ""
                            for group in all_groups:
                                if result["group_id"] == group.group_id:
                                    title = group.name
                        else:
                            title = ""
                        data = {
                            "status": "success",
                            "type": "url",
                            "title": title,
                            "num_of_hit": blogs.count(),
                            "group_id": result["group_id"],
                            "items": blogs_data,
                        }
                        return Response(data, status.HTTP_200_OK)
                    else:
                        return Response(
                            {
                                "status": "not_found_blogs",
                                "type": "url",
                                "message": "not found blogs",
                            },
                            status.HTTP_200_OK,
                        )
                else:
                    return Response(
                        {
                            "status": "url_is_unjust",
                            "type": "url",
                            "message": "url is unjust",
                        },
                        status.HTTP_200_OK,
                    )

            elif result["type"] == "member":
                if result["class"] == "appropriate":
                    members = otapick.search_members(result)
                    if members is not None:
                        members_data = self.serialize_members(members)

                        data = {
                            "status": "success",
                            "type": "member",
                            "num_of_hit": members.count(),
                            "items": members_data,
                        }
                        return Response(data, status.HTTP_200_OK)
                    else:
                        return Response(
                            {
                                "status": "not_found_member",
                                "type": "member",
                                "message": "not found member",
                            },
                            status.HTTP_200_OK,
                        )
                else:
                    return Response(
                        {
                            "status": "text_is_unjust",
                            "type": "member",
                            "message": "url is unjust",
                        },
                        status.HTTP_200_OK,
                    )
        else:
            return Response(
                {"status": "not_found_q", "message": "not found q params"},
                status.HTTP_200_OK,
            )


searchAPIView = SearchAPIView.as_view()


class SearchSuggestionsAPIView(SearchAPIView):
    query_set_length = 11

    def serialize_blogs(self, blogs):
        ### query_setの制限 ###
        if len(blogs) > self.query_set_length:
            blogs = blogs[: self.query_set_length]
            blogs_data = BlogSerializerVerSS(blogs, many=True).data
            blogs_data.append(
                otapick.generate_watch_more("/search?q=" + urllib.parse.quote(self.q))
            )
        else:
            blogs_data = BlogSerializerVerSS(blogs, many=True).data
        ### query_setの制限 ###
        return blogs_data

    def serialize_members(self, members):
        ### query_setの制限 ###
        if len(members) > self.query_set_length:
            members = members[: self.query_set_length]
            members_data = MemberSerializerVerSS(members, many=True).data
            members_data.append(
                otapick.generate_watch_more("/search?q=" + urllib.parse.quote(self.q))
            )
        else:
            members_data = MemberSerializerVerSS(members, many=True).data
        ### query_setの制限 ###
        return members_data


searchSuggestionsAPIView = SearchSuggestionsAPIView.as_view()


class SearchSuggestionsInitAPIView(views.APIView):
    num_of_get = 5

    def get(self, request, *args, **kwargs):
        groups_str = self.request.GET.get("groups", "")  # ex) '1,2,   3'
        groups = convert_querystring_to_list(groups_str)  # ex) [1, 2, 3]

        if groups and all([type(g) is int for g in groups]):
            base_blogs = Blog.objects.filter(publishing_group__group_id__in=groups)
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
                    groups = [
                        sakura_group.id if group_id == keyaki_group.id else group_id
                        for group_id in groups
                    ]
                base_members = Member.objects.filter(
                    belonging_group_id__in=groups, temporary=False, is_other=False
                )
            else:
                base_members = Member.objects.filter(temporary=False, is_other=False)

            # この時点でbase_membersが存在しない場合(ex. groups=12,23)
            if not base_members.exists():
                base_members = Member.objects.filter(temporary=False, is_other=False)
        else:
            base_blogs = Blog.objects.all()
            base_members = Member.objects.filter(temporary=False, is_other=False)

        # popularity_blogs
        popularity_blogs = otapick.sort_blogs(base_blogs, "popularity")[
            : self.num_of_get
        ]
        blogs_data = BlogSerializerVerSS(popularity_blogs, many=True).data
        blogs_data.append(otapick.generate_watch_more("/blogs/"))

        # random members
        random_members = base_members.order_by("?")[: self.num_of_get]
        members_data = MemberSerializerVerSS(random_members, many=True).data
        members_data.append(otapick.generate_watch_more("/members/"))

        return Response(
            {"blogs": blogs_data, "members": members_data}, status.HTTP_200_OK
        )


searchSuggestionsInitAPIView = SearchSuggestionsInitAPIView.as_view()
