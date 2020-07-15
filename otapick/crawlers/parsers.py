"""parsersモジュール
BeautifulSoupによるDOM解析はここで行う。
共通の仕様
    ・引数にBeautifulSoupオブジェクトを受け取る。
    ・タグ、またはタグリスト、その他解析データを返す(success)。Noneを返す(failed)。
    ・関数名は「get」で始め、どんなタグや解析データを取得するか把握できる命名にする。
    ・BeautifulSoupオブジェクトの仮引数名は、未加工の場合に「soup」、明示的にタグを指定する場合は変更する。
    ・タグを返す場合、関数名の最後は「tag」、タグリストを返す場合、「tags」をつける。
    ・findなどで探したうえでなかった場合のNoneはotapick.console()でメッセージを出力。
"""
import otapick


def get_article_tag(group_id, soup):
    if group_id == 1:
        article_tag = soup.find('div', class_='box-article')
    elif group_id == 2:
        article_tag = soup.find('div', class_='c-blog-article__text')
    else:
        return
    if article_tag is None:
        otapick.print_console('article_tag not found')
    return article_tag

def get_member_image_tag(group_id, soup):
    if group_id == 1:
        image_tag = soup.find('div', class_='box-profile_img')
    elif group_id == 2:
        image_tag = soup.find('div', class_='c-member__thumb')
    else:
        return
    image_tag = image_tag.find('img')
    if image_tag is None:
        otapick.print_console('image_tag not found')
    return image_tag

def get_member_image_tag_ex(soup):
    image_tag = soup.find('td', class_='infobox-image-wrapper')
    image_tag = image_tag.find('img')
    if image_tag is None:
        otapick.print_console('image_tag not found')
    return image_tag

def get_blog_image_tags(group_id, soup):
    article_tag = get_article_tag(group_id, soup)
    if article_tag is None: return
    image_tags = article_tag.find_all('img')
    return image_tags

def get_blog_tags(group_id, soup):
    if group_id == 1:
        blog_tags = soup.select('article')
    elif group_id == 2:
        blog_tags = soup.select('div.p-blog-article')
    else:
        return
    if blog_tags is None:
        otapick.print_console('blog_tags not found')
    return blog_tags

def get_blog_url(group_id, blog_tag):
    if group_id == 1:
        bottomul_tag = blog_tag.select_one('div.box-bottom ul')
        bottomli_tags = bottomul_tag.select('li')
        blog_url = bottomli_tags[1].find('a').get('href')
    elif group_id == 2:
        blog_url = blog_tag.select_one('div.p-button__blog_detail').find('a').get('href')
    else:
        return
    if blog_url is None:
        otapick.print_console('blog_url not found')
    return blog_url

def get_blog_title_tag(group_id, blog_tag):
    if group_id == 1:
        title_tag = blog_tag.select_one('.box-ttl a')
    elif group_id == 2:
        title_tag = blog_tag.select_one('div.c-blog-article__title')
    else:
        return
    if title_tag is None:
        otapick.print_console('title_tag not found')
    return title_tag

def get_blog_postdate_tag(group_id, blog_tag):
    if group_id == 1:
        bottomul_tag = blog_tag.select_one('div.box-bottom ul')
        bottomli_tags = bottomul_tag.select('li')
        postdate_tag = bottomli_tags[0]
    elif group_id == 2:
        postdate_tag = blog_tag.select_one('div.p-blog-article__info > div.c-blog-article__date')
    else:
        return
    if postdate_tag is None:
        otapick.print_console('postdate_tag not found')
    return postdate_tag

def get_blog_writer_name(group_id, blog_tag):
    if group_id == 1:
        writer_name = blog_tag.select_one('div.box-ttl > p.name').text
    elif group_id == 2:
        writer_name = blog_tag.select_one('div.p-blog-article__info > div.c-blog-article__name').text
    else:
        return
    if writer_name is None:
        otapick.print_console('writer_name not found')
    return writer_name

def get_url_list(img_tags):
    url_list = []
    for img_tag in img_tags:
        img_url = img_tag.get('src')
        # Omit fake image URL.
        if img_url == '' or img_url is None or not img_url.startswith('http'):
            continue
        else:
            url_list.append(img_url)
    return url_list