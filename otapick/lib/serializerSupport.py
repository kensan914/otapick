import otapick


def generate_url(blog=None, member=None, needBlogs=True, needImages=True):
    if blog is not None:
        return '/blog/{}/{}'.format(blog.writer.belonging_group.group_id, blog.blog_ct)
    elif member is not None:
        ct = ''
        if member.independence: ct = member.ct
        elif member.belonging_group.group_id == 1: ct = 1002
        elif member.belonging_group.group_id == 2: ct = 1000

        blogs_url = '/blogs/{}/{}'.format(member.belonging_group.group_id, ct)
        images_url = '/images/{}/{}'.format(member.belonging_group.group_id, ct)
        if needBlogs ^ needImages:
            if needBlogs: return blogs_url
            if needImages: return images_url
        return {'blogs': blogs_url, 'images': images_url}


def generate_official_url(blog=None, member=None):
    if blog is not None:
        if blog.writer.belonging_group.group_id == 1:
            return 'https://www.keyakizaka46.com/s/k46o/diary/detail/{}?ima=0000&cd=member'.format(blog.blog_ct)
        elif blog.writer.belonging_group.group_id == 2:
            return 'https://www.hinatazaka46.com/s/official/diary/detail/{}?ima=0000&cd=member'.format(blog.blog_ct)
        else: return
    elif member is not None:
        if member.belonging_group.group_id == 1:
            return 'https://www.keyakizaka46.com/s/k46o/artist/{}?ima=0000'.format(member.ct)
        elif member.belonging_group.group_id == 2:
            return 'https://www.hinatazaka46.com/s/official/artist/{}?ima=0000'.format(member.ct)
        else: return


def generate_memberimage_url(member):
    if hasattr(member, 'image'):
        if member.image:
            return member.image.url
    return otapick.OTAPICK_LOGO


def generate_thumbnail_url(blog):
    return blog.thumbnail.picture.url if hasattr(blog, 'thumbnail') else otapick.IMAGE_NOT_FOUND_URL


def generate_writer_name(member):
    if member.ct == '1002' or member.ct == '1000':
        return member.first_kanji
    else:
        return member.full_kanji
