from api.otapick.image.modules import compress_blog_image
from api.otapick.lib.constants import (
    IMAGE_NOT_FOUND_HEIGHT,
    IMAGE_NOT_FOUND_WIDTH,
    OTAPICK_LOGO,
    IMAGE_NOT_FOUND_URL,
)
from api.models.image.models import Image
from api.models.main.models import Member, Group


def generate_url(blog=None, member=None, needBlogs=True, needImages=True):
    if blog is not None:
        return "/blog/{}/{}/".format(blog.publishing_group.group_id, blog.blog_ct)
    elif member is not None:
        ct = ""
        if member.independence:
            ct = member.ct
        elif member.belonging_group.group_id == 1:
            ct = (
                Member.objects.filter(belonging_group__group_id=1, temporary=True)
                .first()
                .ct
            )
        elif member.belonging_group.group_id == 2:
            ct = (
                Member.objects.filter(belonging_group__group_id=2, temporary=True)
                .first()
                .ct
            )

        blogs_url = "/blogs/{}/{}/".format(member.belonging_group.group_id, ct)
        images_url = "/images/{}/{}/".format(member.belonging_group.group_id, ct)
        if needBlogs ^ needImages:
            if needBlogs:
                return blogs_url
            if needImages:
                return images_url
        return {"blogs": blogs_url, "images": images_url}


def generate_official_url(blog=None, member=None):
    if blog is not None:
        for group in Group.objects.all():
            if blog.publishing_group.group_id == group.group_id:
                return group.blog_url_format.format(blog.blog_ct)
    elif member is not None:
        for group in Group.objects.all():
            if member.belonging_group.group_id == group.group_id:
                return group.member_url_format.format(member.ct)
    return


def generate_memberimage_url(member):
    if hasattr(member, "image"):
        if member.image:
            return member.image.url
    return OTAPICK_LOGO


def get_thumbnail_wh(blog):
    thumbnails = Image.objects.filter(publisher=blog, order=0)
    if thumbnails.exists():
        thumbnail = thumbnails.first()
        return thumbnail.width, thumbnail.height
    else:
        return IMAGE_NOT_FOUND_WIDTH, IMAGE_NOT_FOUND_HEIGHT


def generate_thumbnail_url(blog):
    keys = ["originals", "250x", "500x"]
    if Image.objects.filter(publisher=blog, order=0).exists():
        thumbnail = Image.objects.get(publisher=blog, order=0)
        if bool(thumbnail.picture_250x) and bool(thumbnail.picture_500x):
            return dict(
                zip(
                    keys,
                    [
                        thumbnail.picture.url,
                        thumbnail.picture_250x.url,
                        thumbnail.picture_500x.url,
                    ],
                )
            )
        else:
            compress_blog_image(thumbnail)
            if bool(thumbnail.picture_250x) and bool(thumbnail.picture_500x):
                return dict(
                    zip(
                        keys,
                        [
                            thumbnail.picture.url,
                            thumbnail.picture_250x.url,
                            thumbnail.picture_500x.url,
                        ],
                    )
                )

    return dict(zip(keys, [IMAGE_NOT_FOUND_URL for i in range(len(keys))]))


def generate_thumbnail_url_SS(blog):
    if Image.objects.filter(publisher=blog, order=0).exists():
        thumbnail = Image.objects.get(publisher=blog, order=0)
        if bool(thumbnail.picture_250x):
            return thumbnail.picture_250x.url
    return IMAGE_NOT_FOUND_URL


def generate_writer_name(member):
    if member.temporary:
        return member.first_kanji
    else:
        return member.full_kanji


def generate_image_src(image):
    keys = ["originals", "250x", "500x"]
    if image is not None:
        if bool(image.picture):
            if bool(image.picture_250x) and bool(image.picture_500x):
                return dict(
                    zip(
                        keys,
                        [
                            image.picture.url,
                            image.picture_250x.url,
                            image.picture_500x.url,
                        ],
                    )
                )
            else:  # originalは存在するが圧縮されていない場合
                compress_blog_image(image)
                if bool(image.picture_250x) and bool(image.picture_500x):
                    return dict(
                        zip(
                            keys,
                            [
                                image.picture.url,
                                image.picture_250x.url,
                                image.picture_500x.url,
                            ],
                        )
                    )
    return dict(zip(keys, [IMAGE_NOT_FOUND_URL for i in range(len(keys))]))
