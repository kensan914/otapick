import re
from django.db.models import Q
from main.models import Member, Blog, MemberKeyword
import jaconv
import otapick

"""
search_blogs() search_members()
引数として渡されたqパラメータ情報(parse_q()で返されたdictionary)から、それぞれ合致したクエリセットを返す。
"""


def search_blogs(q_info):
    if q_info["class"] == "detail":
        blogs = Blog.objects.filter(
            publishing_group__group_id=q_info["group_id"], blog_ct=q_info["blog_ct"]
        )
    elif q_info["class"] == "searchByLatest":
        blogs = Blog.objects.filter(
            publishing_group__group_id=q_info["group_id"], writer__graduate=False
        ).order_by("-post_date", "order_for_simul")
    elif q_info["class"] == "searchByBlogs":
        blogs = Blog.objects.filter(
            publishing_group__group_id=q_info["group_id"], writer__graduate=False
        )
        if q_info["dy"] and q_info["dy"]["year"] and q_info["dy"]["month"]:
            blogs = search_blogs_by_dy(blogs, q_info["dy"])
        else:
            blogs = blogs.order_by("-post_date", "order_for_simul")
    elif q_info["class"] == "searchByMembers":
        blogs = Blog.objects.filter(
            publishing_group__group_id=q_info["group_id"], writer__ct=q_info["ct"]
        )
        if q_info["dy"] and q_info["dy"]["year"] and q_info["dy"]["month"]:
            blogs = search_blogs_by_dy(blogs, q_info["dy"])
        else:
            blogs = blogs.order_by("-post_date", "order_for_simul")
    else:
        return

    if blogs.exists():
        return blogs
    else:
        return


def search_blogs_by_dy(origin_blogs, dy):
    dy_blogs = origin_blogs.filter(
        post_date__year=dy["year"], post_date__month=dy["month"]
    )
    if dy["day"]:
        return dy_blogs.filter(post_date__day=dy["day"]).order_by(
            "-post_date", "order_for_simul"
        )
    else:
        return dy_blogs.order_by("-post_date", "order_for_simul")


def search_members(q_info):
    _text = q_info["text"]

    # 全角 ⇒ 半角 & ノーマライズ. ex) 'ｋAげヤmay' => 'kAげヤmay'
    cleaned_text = jaconv.normalize(_text, "NFKC")

    # カタカナ => ひらがな. ex) 'kAげヤmay' => 'kAげやmay'
    cleaned_text = jaconv.kata2hira(cleaned_text)

    # 大文字 => 小文字. ex) 'kAげやmay' => 'kaげやmay'
    cleaned_text = cleaned_text.lower()

    # 英語 => ひらがな. ex) 'kaげやmay' => {'is_success': False, 'text': 'かげやま'}
    result = otapick.alphabet2kana(cleaned_text)
    if result["is_success"]:
        # 全てひらがなの状態
        cleaned_text = result["text"]
    else:
        # ひらがな変換が失敗し、
        cleaned_text = result["text"]

    # メタ文字(* \ | ? +)をエスケープ
    meta_char_tuple = (
        "\\",
        "*",
        "+",
        ".",
        "?",
        "{",
        "}",
        "(",
        ")",
        "[",
        "]",
        "^",
        "$",
        "-",
        "|",
        "/",
    )
    for meta_char in meta_char_tuple:
        if meta_char in cleaned_text:
            cleaned_text = cleaned_text.replace(meta_char, "\\{}".format(meta_char))

    matched_members = Member.objects.filter(
        Q(full_kana__iregex=r"^%s" % cleaned_text)
        | Q(first_kana__iregex=r"^%s" % cleaned_text)
        | Q(full_kanji__iregex=r"^%s" % cleaned_text)
        | Q(first_kanji__iregex=r"^%s" % cleaned_text)
        | Q(full_eng__iregex=r"^%s" % cleaned_text)
        | Q(first_eng__iregex=r"^%s" % cleaned_text)
    )

    matched_member_keywords = MemberKeyword.objects.filter(
        keyword__iregex=r"^%s" % cleaned_text
    )

    # keywordもマッチした場合
    if matched_member_keywords.count() > 0:
        matched_member_pk_list = [
            matched_member.pk for matched_member in matched_members
        ]
        matched_keyword_member_pk_list = [
            matched_member_keyword.member.pk
            for matched_member_keyword in matched_member_keywords
        ]
        member_pk_list = list(
            set(matched_member_pk_list + matched_keyword_member_pk_list)
        )  # 重複を削除
        members = Member.objects.filter(pk__in=member_pk_list)
    else:
        members = matched_members

    if members.exists():
        return members
    else:
        return
