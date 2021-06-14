from django.http import FileResponse
from rest_framework import views, status, permissions
from rest_framework.response import Response

from api.models.account.models import MAX_FAVORITE_IMAGES_NUM_UNLIMITED_SIGN
from api.models.image.models import Image, Favorite
from api.models.main.models import Group, Blog
from api.otapick.extensions.views_ex import (
    convert_querystring_to_list,
    sort_by_recommend_score,
    generate_images_data,
    ImageListInfo,
    sort_images_by_related,
    get_additional_data,
)
from api import otapick


class ImageDetailAPIView(views.APIView):
    def put(self, request, *args, **kwargs):
        group_id = self.kwargs.get("group_id")
        blog_ct = self.kwargs.get("blog_ct")
        order = self.kwargs.get("order")

        # inform of blog view
        if "action" in request.data and request.data["action"] == "view":
            if "key" in request.data and request.data["key"] == otapick.VIEW_KEY:
                images = Image.objects.filter(
                    publisher__publishing_group__group_id=group_id,
                    publisher__blog_ct=blog_ct,
                    order=order,
                )
                if images.exists():
                    image = images.first()
                    otapick.increment_num_of_views(image=image, num=1)
                    return Response({"status": "success"}, status.HTTP_200_OK)
                else:
                    return Response({"status": "image_not_found"}, status.HTTP_200_OK)
            else:
                return Response({"status": "unjust_key"}, status.HTTP_200_OK)

        # inform of image download for mobile
        elif "action" in request.data and request.data["action"] == "download":
            if "key" in request.data and request.data["key"] == otapick.DOWNLOAD_KEY:
                images = Image.objects.filter(
                    publisher__publishing_group__group_id=group_id,
                    publisher__blog_ct=blog_ct,
                    order=order,
                )
                if images.exists():
                    image = images.first()
                    otapick.increment_num_of_downloads(image, image.publisher, num=1)
                    otapick.edit_num_of_most_downloads(image.publisher)
                    return Response({"status": "success"}, status.HTTP_200_OK)
                else:
                    return Response({"status": "image_not_found"}, status.HTTP_200_OK)
            else:
                return Response({"status": "unjust_key"}, status.HTTP_200_OK)
        else:
            return Response({"status": "failed"}, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get("group_id")
        blog_ct = self.kwargs.get("blog_ct")
        order = self.kwargs.get("order")

        try:
            images = Image.objects.filter(
                publisher__publishing_group__group_id=group_id,
                publisher__blog_ct=blog_ct,
                order=order,
            )
            if images.exists():
                image = images.first()
                # rewrite num_of_downloads
                otapick.increment_num_of_downloads(image, image.publisher, num=1)
                otapick.edit_num_of_most_downloads(image.publisher)
                return FileResponse(image.picture, as_attachment=True)
            else:
                return Response({"status": "image_not_found"}, status.HTTP_200_OK)
        except:
            return Response({"status": "failed"}, status.HTTP_200_OK)


imageDetailAPIView = ImageDetailAPIView.as_view()


class ImageListAPIView(views.APIView):
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(
            self.kwargs.get("group_id"), self.kwargs.get("ct")
        )
        _page = self.request.GET.get("page")
        page = int(_page) if _page is not None and _page.isdecimal() else 1
        random_seed_str = self.request.GET.get("random_seed", "0")
        random_seed = int(random_seed_str) if random_seed_str.isdecimal() else 0
        order_format = self.request.GET.get("sort", "")
        # + groups 効率のためrecommend処理内でget

        # filter
        if group_id is not None:
            if ct is None:
                images = Image.objects.filter(
                    publisher__publishing_group__group_id=group_id
                )
            else:
                if Group.objects.filter(is_active=True, group_id=group_id).exists():
                    images = Image.objects.filter(
                        publisher__writer__belonging_group__group_id=group_id,
                        publisher__writer__ct=ct,
                    )
                else:  # ex) images/3/01/ ☚メンバー絞込みでis_active=Falseのグループを指定することはできない
                    return Response({"status": "failed"}, status.HTTP_404_NOT_FOUND)
            if not images.exists():
                return Response({"status": "image_not_found"}, status.HTTP_200_OK)

        # recommend
        else:
            # groups query parameterはrecommendの時のみ有効
            groups_str = self.request.GET.get("groups", "")  # ex) '1,2,   3'
            groups = convert_querystring_to_list(groups_str)  # ex) [1, 2, 3]

            images = otapick.get_filtered_images_group_ids(groups)

        # sort and slice
        result = otapick.sort_images(images, order_format)

        # success sorted
        if result is not None:
            sorted_images = result
            # to create id_list will be faster
            sorted_images = sorted_images[
                self.paginate_by * (page - 1) : self.paginate_by * page
            ]
            id_list = list(sorted_images.values_list("id", flat=True))
            images = [images.get(id=pk) for pk in id_list]

        # hove to sort by recommend
        else:
            images_id_list = sort_by_recommend_score(
                images, page, random_seed, self.paginate_by
            )
            images = [images.get(id=pk) for pk in images_id_list]

        return Response(generate_images_data(images, request), status.HTTP_200_OK)


imageListAPIView = ImageListAPIView.as_view()


class ImageListInfoAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        group_id, ct = otapick.shape_ct(
            self.kwargs.get("group_id"), self.kwargs.get("ct")
        )
        order_format = self.request.GET.get("sort")
        return Response(
            ImageListInfo(group_id, ct, order_format).get_result(),
            status.HTTP_200_OK,
        )


imageListInfoAPIView = ImageListInfoAPIView.as_view()


class RelatedImageListAPIView(ImageListAPIView):
    def get(self, request, *args, **kwargs):
        group_id = self.kwargs.get("group_id")
        blog_ct = self.kwargs.get("blog_ct")
        order = self.kwargs.get("order")
        _page = self.request.GET.get("page")
        page = int(_page) if _page is not None and _page.isdecimal() else 1

        blogs = Blog.objects.filter(
            publishing_group__group_id=group_id, blog_ct=blog_ct
        )
        if (
            blogs.exists()
            and Image.objects.filter(publisher=blogs.first(), order=order).exists()
        ):
            images_id_list = sort_images_by_related(
                blogs.first(), order, page, self.paginate_by
            )
            images = [Image.objects.get(id=pk) for pk in images_id_list]
            return Response(generate_images_data(images, request), status.HTTP_200_OK)
        else:
            return Response({"status": "image_not_found"}, status.HTTP_200_OK)


relatedImageListAPIView = RelatedImageListAPIView.as_view()


class HomeAPIView(ImageListAPIView):
    def get(self, request, *args, **kwargs):
        random_seed_str = self.request.GET.get("random_seed", "0")
        random_seed = int(random_seed_str) if random_seed_str.isdecimal() else 0
        page_str = self.request.GET.get("page", "1")
        page = int(page_str) if page_str.isdecimal() else 1
        groups_str = self.request.GET.get("groups", "")  # ex) '1,2,   3'
        groups = convert_querystring_to_list(groups_str)  # ex) [1, 2, 3]

        images = otapick.get_filtered_images_group_ids(groups)

        images_id_list = sort_by_recommend_score(
            images, page, random_seed, self.paginate_by
        )
        images = [images.get(id=pk) for pk in images_id_list]

        return Response(generate_images_data(images, request), status.HTTP_200_OK)


homeAPIView = HomeAPIView.as_view()


class HomeAdditionalAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        random_seed_str = self.request.GET.get("random_seed", "0")
        random_seed = int(random_seed_str) if random_seed_str.isdecimal() else 0
        groups_str = self.request.GET.get("groups", "")  # ex) '1,2,   3'
        groups = convert_querystring_to_list(groups_str)  # ex) [1, 2, 3]

        return Response(
            get_additional_data(random_seed, request, filter_group_ids=groups),
            status.HTTP_200_OK,
        )


homeAdditionalAPIView = HomeAdditionalAPIView.as_view()


class FavoriteAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_image(self, kwargs):
        group_id = kwargs.get("group_id")
        blog_ct = kwargs.get("blog_ct")
        order = kwargs.get("order")
        images = Image.objects.filter(
            publisher__publishing_group__group_id=group_id,
            publisher__blog_ct=blog_ct,
            order=order,
        )
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
            return Response({"status": "not_found"}, status.HTTP_404_NOT_FOUND)

        favorites = Favorite.objects.filter(user=request.user)
        if (
            request.user.max_favorite_images_num
            != MAX_FAVORITE_IMAGES_NUM_UNLIMITED_SIGN
            and request.user.max_favorite_images_num <= favorites.count()
        ):
            # max値を超えている
            return Response({"status": "exceed_max_num"}, status.HTTP_409_CONFLICT)

        created_favorite = self.get_favorite(image, request.user)
        if created_favorite is None:
            Favorite.objects.create(
                image=image,
                user=request.user,
            )
        return Response({"status": "success"}, status.HTTP_200_OK)

    # 中間テーブル(favoriteテーブル)を削除しているため
    def delete(self, request, *args, **kwargs):
        image = self.get_image(self.kwargs)
        if image is not None:
            favorite = self.get_favorite(image, request.user)
            if favorite is not None:
                favorite.delete()
            return Response(status.HTTP_204_NO_CONTENT)
        return Response({"status": "not_found"}, status.HTTP_404_NOT_FOUND)


favoriteAPIView = FavoriteAPIView.as_view()


class FavoriteListAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        _page = self.request.GET.get("page")
        page = int(_page) if _page is not None and _page.isdecimal() else 1

        favorites = Favorite.objects.filter(user=request.user)
        favorites = favorites[self.paginate_by * (page - 1) : self.paginate_by * page]
        images = [favorite.image for favorite in favorites]
        return Response(generate_images_data(images, request), status.HTTP_200_OK)


favoriteListAPIView = FavoriteListAPIView.as_view()


class FavoriteListInfoAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        favorites = Favorite.objects.filter(user=request.user)

        return Response(
            {
                "favorites_num": favorites.count(),
                "max_favorites_num": request.user.max_favorite_images_num
                if request.user
                else 0,
            },
            status.HTTP_200_OK,
        )


favoriteListInfoAPIView = FavoriteListInfoAPIView.as_view()
