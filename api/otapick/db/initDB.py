from api.models.main.models import Group, Member, MemberKeyword
from api.otapick.lib.utils import print_console
import csv


group_key_list = [
    "name",
    "group_id",
    "domain",
    "key",
    "is_active",
    "blog_list_paginate_by",
    "blog_list_paginate_by_mobile",
    "latest_list_paginate_by",
    "latest_list_paginate_by_mobile",
    "blog_url_format",
    "member_url_format",
]
member_key_list = [
    "ct",
    "last_kanji",
    "first_kanji",
    "full_kanji",
    "last_kana",
    "first_kana",
    "full_kana",
    "last_eng",
    "first_eng",
    "group_id",
    "graduate",
    "independence",
    "temporary",
    "generation",
    "is_other",
]
keys_with_int_as_value = [
    "group_id",
    "generation",
    "blog_list_paginate_by",
    "blog_list_paginate_by_mobile",
    "latest_list_paginate_by",
    "latest_list_paginate_by_mobile",
]
member_keyword_key_list = [
    "group_id",
    "ct",
    "full_kanji",
    "keywords",
]

# ex) いまゆい.imayui/ずーみん.zu-min/ゆいふる.yuihuru
MEMBER_KEYWORD_SPLIT_SIGN = "/"
MEMBER_KEYWORD_SET_SPLIT_SIGN = "."


def init_group():
    fin = open("otapick/db/corpus/groupList.csv", "rt", encoding="utf-8")
    group_csv_list = csv.DictReader(
        fin,
        delimiter=",",
        doublequote=True,
        lineterminator="\r\n",
        quotechar='"',
        skipinitialspace=True,
    )

    for group_csv in group_csv_list:
        group_csv = format_dict_csv(group_csv, group_key_list)
        groups = Group.objects.filter(group_id=group_csv["group_id"])
        if not groups.exists():
            Group.objects.create(
                name=group_csv["name"],
                group_id=int(group_csv["group_id"]),
                domain=group_csv["domain"],
                key=group_csv["key"],
                is_active=group_csv["is_active"],
                blog_list_paginate_by=group_csv["blog_list_paginate_by"],
                blog_list_paginate_by_mobile=group_csv["blog_list_paginate_by_mobile"],
                latest_list_paginate_by=group_csv["latest_list_paginate_by"],
                latest_list_paginate_by_mobile=group_csv[
                    "latest_list_paginate_by_mobile"
                ],
                blog_url_format=group_csv["blog_url_format"],
                member_url_format=group_csv["member_url_format"],
            )
            print_console("{} is registered!".format(group_csv["name"]))
        else:
            target_group = groups.first()
            for key, val in group_csv.items():
                if key == "group_id":
                    if target_group.group_id != int(val):
                        print_console(
                            "{}の{}を{}に変更しました。".format(target_group.name, key, int(val))
                        )
                        target_group.group_id = int(val)
                # https://oshiete.goo.ne.jp/qa/8952513.html
                elif target_group.__dict__[key] != val:
                    print_console(
                        "{}の{}を{}に変更しました。".format(target_group.name, key, val)
                    )
                    target_group.__dict__[key] = val
                target_group.save()
    fin.close()


def init_member():
    fin = open("otapick/db/corpus/memberList.csv", "rt", encoding="utf-8")
    member_csv_list = csv.DictReader(
        fin,
        delimiter=",",
        doublequote=True,
        lineterminator="\r\n",
        quotechar='"',
        skipinitialspace=True,
    )

    for member_csv in member_csv_list:
        member_csv = format_dict_csv(member_csv, member_key_list)

        members = Member.objects.filter(
            ct=member_csv["ct"], belonging_group__group_id=member_csv["group_id"]
        )
        if not members.exists():
            Member.objects.create(
                ct=member_csv["ct"],
                last_kanji=member_csv["last_kanji"],
                first_kanji=member_csv["first_kanji"],
                full_kanji=member_csv["full_kanji"],
                last_kana=member_csv["last_kana"],
                first_kana=member_csv["first_kana"],
                full_kana=member_csv["full_kana"],
                last_eng=member_csv["last_eng"],
                first_eng=member_csv["first_eng"],
                full_eng=member_csv["last_eng"] + member_csv["first_eng"],
                belonging_group=Group.objects.get(group_id=member_csv["group_id"]),
                graduate=member_csv["graduate"],
                independence=member_csv["independence"],
                temporary=member_csv["temporary"],
                generation=member_csv["generation"],
                is_other=member_csv["is_other"],
            )
            print_console("{} is registered!".format(member_csv["full_kanji"]))

        else:
            target_member = members.first()
            for key, val in member_csv.items():
                if key == "group_id":
                    if target_member.belonging_group.group_id != int(val):
                        target_member.belonging_group = Group.objects.get(
                            group_id=int(val)
                        )
                        print_console(
                            "{}の{}を{}に変更しました。".format(
                                target_member.full_kanji, key, int(val)
                            )
                        )
                # https://oshiete.goo.ne.jp/qa/8952513.html
                elif target_member.__dict__[key] != val:
                    target_member.__dict__[key] = val
                    print_console(
                        "{}の{}を{}に変更しました。".format(target_member.full_kanji, key, val)
                    )
                target_member.save()
    fin.close()


def init_member_keyword():
    """
    memberのDB情報をセットしている前提
    """
    fin = open("otapick/db/corpus/memberKeywordList.csv", "rt", encoding="utf-8")
    member_keyword_csv_list = csv.DictReader(
        fin,
        delimiter=",",
        doublequote=True,
        lineterminator="\r\n",
        quotechar='"',
        skipinitialspace=True,
    )

    for member_keyword_csv in member_keyword_csv_list:
        member_keyword_csv = format_dict_csv(
            member_keyword_csv, member_keyword_key_list
        )

        members = Member.objects.filter(
            ct=member_keyword_csv["ct"],
            belonging_group__group_id=member_keyword_csv["group_id"],
        )
        if not members.exists():
            print_console(
                "{}のメンバー情報は登録されていません。".format(member_keyword_csv["full_kanji"])
            )
        else:
            target_member = members.first()
            for kw in member_keyword_csv["keywords"].split(MEMBER_KEYWORD_SPLIT_SIGN):
                if (
                    type(kw) == str
                    and len(kw) > 0
                    and not MemberKeyword.objects.filter(
                        keyword=kw, member=target_member
                    ).exists()
                ):
                    MemberKeyword.objects.create(keyword=kw, member=target_member)
                    print_console(
                        "「{}」を{}のキーワードとして登録しました。".format(kw, target_member.full_kanji)
                    )
    fin.close()


def format_dict_csv(dict_csv, key_list):
    new_dict_csv = {}
    for key in key_list:
        if key in dict_csv:
            val = dict_csv[key]

            # actually format value
            if val.lower() == "true":
                val = True
            elif val.lower() == "false":
                val = False

            if key in keys_with_int_as_value:
                val = int(val)

            new_dict_csv[key] = val
        else:
            raise Exception("There is an unexpected key({}) in csv.".format(key))

    return new_dict_csv
