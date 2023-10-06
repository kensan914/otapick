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
from urllib.parse import urljoin

from api import otapick


def get_article_tag(group_key, soup):
    if group_key == "keyaki" or group_key == "sakura":
        article_tag = soup.find("div", class_="box-article")
    elif group_key == "hinata":
        article_tag = soup.find("div", class_="c-blog-article__text")
    ### Edit ###
    else:
        return
    if article_tag is None:
        otapick.print_console("article_tag not found")
    return article_tag


def get_member_image_tag(group_key, soup):
    if group_key == "keyaki":
        image_tag = soup.find("div", class_="box-profile_img")
    elif group_key == "hinata":
        image_tag = soup.find("div", class_="c-member__thumb")
    elif group_key == "sakura":
        image_tag = soup.find("p", class_="ph")
    ### Edit ###
    else:
        return
    if image_tag is None:
        otapick.print_console(
            "image_tag_wrapper not found. 指定したctのメンバーのプロフィールページが存在しない場合がございます。"
        )
        return
    image_tag = image_tag.find("img")
    if image_tag is None:
        otapick.print_console("image_tag not found")
    return image_tag


def get_member_image_tag_ex(soup):
    image_tag = soup.find("td", class_="infobox-image-wrapper")
    image_tag = image_tag.find("img")
    if image_tag is None:
        otapick.print_console("image_tag not found")
    return image_tag


def get_blog_image_tags(group_key, soup):
    article_tag = get_article_tag(group_key, soup)
    if article_tag is None:
        return
    image_tags = article_tag.find_all("img")
    return image_tags


# for blog list


def get_blog_tags(group_key, soup):
    if group_key == "keyaki":
        blog_tags = soup.select("article")
    elif group_key == "hinata":
        blog_tags = soup.select("div.p-blog-article")
    elif group_key == "sakura":
        blog_tags = soup.select("ul.com-blog-part > li.box")
    ### Edit ###
    else:
        return
    if blog_tags is None:
        otapick.print_console("blog_tags not found")
    return blog_tags


# for detail
def get_blog_tag(group_key, soup):
    if group_key == "keyaki":
        blog_tag = soup.select_one("article")
    elif group_key == "hinata":
        blog_tag = soup.select_one("div.p-blog-article")
    elif group_key == "sakura":
        blog_tag = soup.select_one("article.post")
    ### Edit ###
    else:
        return
    if blog_tag is None:
        otapick.print_console("blog_tag not found")
    return blog_tag


def get_blog_url(group_key, blog_tag):
    if group_key == "keyaki":
        bottomul_tag = blog_tag.select_one("div.box-bottom ul")
        bottomli_tags = bottomul_tag.select("li")
        blog_url = bottomli_tags[1].find("a").get("href")
    elif group_key == "hinata":
        # HACK: 以下URLの記事が記事一覧にてHTMLが壊れていた。そのため、blog_tag.select_one("div.p-button__blog_detail") が
        # None となってエラーとなっていたので、一時的対処
        # https://www.hinatazaka46.com/s/official/diary/detail/49312?ima=0000&cd=member
        target_tag = blog_tag.select_one("div.p-button__blog_detail")
        blog_url = target_tag.find("a").get("href") if target_tag is not None else None
    elif group_key == "sakura":
        blog_url = blog_tag.find("a").get("href")
    ### Edit ###
    else:
        return
    if blog_url is None:
        otapick.print_console("blog_url not found")
    return blog_url


def get_blog_title_tag(group_key, blog_tag):
    if group_key == "keyaki":
        title_tag = blog_tag.select_one(".box-ttl a")
    elif group_key == "hinata":
        title_tag = blog_tag.select_one("div.c-blog-article__title")
    elif group_key == "sakura":
        title_tag = blog_tag.select_one("h1.title")
    ### Edit ###
    else:
        return
    if title_tag is None:
        otapick.print_console("title_tag not found")
    return title_tag


def get_blog_postdate_tag(group_key, blog_tag):
    if group_key == "keyaki":
        bottomul_tag = blog_tag.select_one("div.box-bottom ul")
        bottomli_tags = bottomul_tag.select("li")
        postdate_tag = bottomli_tags[0]
    elif group_key == "hinata":
        postdate_tag = blog_tag.select_one(
            "div.p-blog-article__info > div.c-blog-article__date"
        )
    elif group_key == "sakura":
        postdate_tag = blog_tag.select_one("div.blog-foot p.date.wf-a")
    ### Edit ###
    else:
        return
    if postdate_tag is None:
        otapick.print_console("postdate_tag not found")
    return postdate_tag


def get_blog_writer_name(group_key, blog_tag):
    if group_key == "keyaki":
        writer_name = blog_tag.select_one("div.box-ttl > p.name").text
    elif group_key == "hinata":
        writer_name = blog_tag.select_one(
            "div.p-blog-article__info > div.c-blog-article__name"
        ).text
    elif group_key == "sakura":
        writer_name = blog_tag.select_one("div.blog-foot p.name").text
    ### Edit ###
    else:
        return
    if writer_name is None:
        otapick.print_console("writer_name not found")
    return writer_name


def get_url_list(img_tags, image_base_url=None):
    url_list = []
    for img_tag in img_tags:
        img_url = img_tag.get("src")
        # Omit fake image URL.
        if img_url == "" or img_url is None:
            continue

        # urlにホストが省略されている場合
        if image_base_url is not None and not img_url.startswith("http"):
            img_url = urljoin(image_base_url, img_url)
        url_list.append(img_url)
    return url_list
