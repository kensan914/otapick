from abc import abstractmethod
from image.models import Image
from main.models import Blog
from django.http.response import HttpResponseServerError
import otapick
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from config import settings
from django.views import View


class BaseView(View):
    html_path = "frontend/index.html"
    context = {
        "version": otapick.VERSION,
        "version_query_string": "?{}".format(otapick.VERSION),
        "debug": settings.env.bool("DEBUG"),
    }


class OgpView(View):
    """
    OGP情報管理Viewクラス. OGP情報はSPA上で動的に設定ができない(https://www.i-ryo.com/entry/2021/04/16/072651)ため、ここで設定
    デフォルト以外はrender前にset_ogp_context()実行
    参考: https://digitalidentity.co.jp/blog/seo/ogp-share-setting.html
    """

    og_url = otapick.OTAPICK_URL
    og_type = "website"
    og_title = otapick.HOME_TITLE
    og_description = otapick.DESCRIPTION
    og_site_name = otapick.SITE_NAME
    og_image = f"{otapick.OTAPICK_URL}{otapick.OGP_IMG_URL}"

    def set_ogp_context(
        self,
        og_url=None,
        og_type=None,
        og_title=None,
        og_description=None,
        og_site_name=None,
        og_image=None,
    ):
        self.og_url = og_url if og_url else self.og_url
        self.og_type = og_type if og_type else self.og_type
        self.og_title = og_title if og_title else self.og_title
        self.og_description = og_description if og_description else self.og_description
        self.og_site_name = og_site_name if og_site_name else self.og_site_name
        self.og_image = og_image if og_image else self.og_image

    def gene_ogp_context(self):
        context = {
            "is_ogp": True,
            "og_url": self.og_url,
            "og_type": self.og_type,
            "og_title": self.og_title,
            "og_description": self.og_description,
            "og_site_name": self.og_site_name,
            "og_image": self.og_image,
        }
        return context


class IndexView(BaseView, OgpView):
    index_context = dict(
        **BaseView.context,
        **{"fqdn": ""},
    )

    @abstractmethod
    def set_other_ogp_context(self, request):
        pass

    def set_fqdn(self, request):
        self.index_context["fqdn"] = request.get_host()

    def get(self, request, *args, **kwargs):
        self.set_fqdn(request)
        self.set_ogp_context(og_url=request.build_absolute_uri())
        self.set_other_ogp_context(request)
        return render(
            request,
            self.html_path,
            {
                **self.index_context,
                **self.gene_ogp_context(),
            },
        )


indexView = IndexView.as_view()


class IndexAdminView(IndexView):
    index_context = dict(
        **BaseView.context,
        **{"fqdn": "admin.{}".format(otapick.OTAPICK_FQDN)},
    )


indexAdminView = IndexAdminView.as_view()


class IndexBlogDetailView(IndexView):
    def set_other_ogp_context(self, request):
        group_id = self.kwargs.get("group_id")
        blog_ct = self.kwargs.get("blog_ct")
        blogs = Blog.objects.filter(
            publishing_group__group_id=group_id, blog_ct=blog_ct
        )
        if blogs.exists():
            blog = blogs.first()
            thumbnail_images = Image.objects.filter(publisher=blog, order=0)
            if thumbnail_images.exists():
                thumbnail_image = thumbnail_images.first()
                self.set_ogp_context(
                    og_image=request.build_absolute_uri(thumbnail_image.picture.url)
                )
            self.set_ogp_context(
                og_type="article",
                og_title=f"{blog.title}({blog.writer.full_kanji})｜ブログ詳細｜{otapick.SITE_NAME}",
            )


indexBlogDetailView = IndexBlogDetailView.as_view()


class IndexImageDetailView(IndexView):
    def set_other_ogp_context(self, request):
        group_id = self.kwargs.get("group_id")
        blog_ct = self.kwargs.get("blog_ct")
        order = self.kwargs.get("order")
        images = Image.objects.filter(
            publisher__publishing_group__group_id=group_id,
            publisher__blog_ct=blog_ct,
            order=order,
        )
        if images.exists():
            image = images.first()
            self.set_ogp_context(
                og_type="article",
                og_title=f"{image.publisher.title}({image.publisher.writer.full_kanji})｜画像詳細｜{otapick.SITE_NAME}",
                og_image=request.build_absolute_uri(image.picture.url),
            )


indexImageDetailView = IndexImageDetailView.as_view()


class MaintenanceView(BaseView):
    def get(self, request, *args, **kwargs):
        isMaintaining = otapick.checkIsMaintaining(settings.BASE_DIR)
        if isMaintaining:
            return HttpResponse(loader.render_to_string("503.html"), status=503)
        else:
            return redirect("/")


maintenanceView = MaintenanceView.as_view()


def server_error(request, template_name="500.html"):
    import requests
    import json
    import traceback

    requests.post(
        otapick.SLACK_WEBHOOKS_OTAPICK_BOT_URL,
        data=json.dumps(
            {
                "text": "\n".join(
                    [
                        f":x: *500 ERROR ALERT* :x:",
                        f"Request URL: {request.build_absolute_uri()}",
                        f"↓↓↓",
                        f"```{traceback.format_exc()}```",
                    ]
                ),
            }
        ),
    )
    return HttpResponseServerError(
        "<h1>申し訳ございません。只今不具合が発生しております。復旧まで今しばらくお待ちください。</h1>"
    )
