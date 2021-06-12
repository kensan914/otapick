from otapick.lib.utils import parse_json
import oauth2 as oauth
from otapick.lib.constants import TWITTER_CK_AUTH, TWITTER_CS_AUTH
from urllib.parse import urljoin
from urllib.parse import urlparse
import traceback
import sys


request_token_url = "https://twitter.com/oauth/request_token"
access_token_url = "https://twitter.com/oauth/access_token"
authenticate_url = "https://twitter.com/oauth/authorize"
callback_url_path = "/accounts/twitter/login/callback/"


def get_request_token(scheme_host):
    try:
        consumer = oauth.Consumer(key=TWITTER_CK_AUTH, secret=TWITTER_CS_AUTH)
        client = oauth.Client(consumer)

        # reqest_token を取得
        resp, content = client.request(
            "{}?&oauth_callback={}".format(
                request_token_url, urljoin(scheme_host, callback_url_path)
            )
        )
        url = content.decode("utf-8")

        # エラー処理
        url_json = parse_json(url)
        if url_json is not None and "errors" in url_json:
            for error in url_json["errors"]:
                if "code" in error and error["code"] == 135:
                    raise Exception("サーバ時間にずれが生じています")
            raise Exception("Twitter API auth error!!")

        qsl = parse_qsl(url)
        if qsl is None:
            return
        request_token = dict(qsl)
        return request_token["oauth_token"]
    except Exception as e:
        traceback.print_exc()
        return


def parse_qsl(url):
    if not ("&" in url and "=" in url):
        return

    param = {}
    for i in url.split("&"):
        _p = i.split("=")
        param.update({_p[0]: _p[1]})
    return param


def get_access_token(oauth_token, oauth_verifier):
    consumer = oauth.Consumer(key=TWITTER_CK_AUTH, secret=TWITTER_CS_AUTH)
    token = oauth.Token(oauth_token, oauth_verifier)

    client = oauth.Client(consumer, token)
    resp, content = client.request(
        "https://api.twitter.com/oauth/access_token",
        "POST",
        body="oauth_verifier={0}".format(oauth_verifier),
    )
    return content


def get_authorize_uri(scheme_host):
    # request tokenを取得
    request_token = get_request_token(scheme_host)
    if request_token is None:
        return

    # request_tokenを認証endpointにつけて認証urlを生成する。
    authorize_uri = "{}?oauth_token={}".format(authenticate_url, request_token)
    return authorize_uri


def gene_twitter_profile_uri(original_uri=""):
    """ """
    original_kw = "normal"
    medium_kw = "200x200"
    large_kw = "400x400"

    profile_image_uri_collection = {
        "profile_image_uri": None,
        "profile_image_thumbnail_uri": None,
        "profile_image_large_uri": None,
    }
    if type(original_uri) != str or not original_uri:
        return profile_image_uri_collection
    # original_uriがURLでない
    if not len(urlparse(original_uri).scheme) > 0:
        return profile_image_uri_collection
    else:
        _original_uri = original_uri
        if original_uri[len(original_uri) - 1] == "/":
            _original_uri = original_uri[0:-1]
        original_uri_list = _original_uri.split("/")

        uri_excluded_file_name = "/".join(original_uri_list[0:-1])
        image_file_name = original_uri_list[len(original_uri_list) - 1]

        count_include_original_kw = image_file_name.count(original_kw)
        # image_fileに'normal'が含まれないとき
        if count_include_original_kw <= 0:
            return profile_image_uri_collection
        else:
            # image_fileに複数'normal'が含まれていた時
            if count_include_original_kw > 1:
                upside_down_image_file_name = image_file_name[::-1]
                upside_down_original_kw = original_kw[::-1]
                medium_image_file_name = upside_down_image_file_name.replace(
                    upside_down_original_kw, medium_kw[::-1], 1
                )[::-1]
                large_image_file_name = upside_down_image_file_name.replace(
                    upside_down_original_kw, large_kw[::-1], 1
                )[::-1]
            # image_fileに'normal'が1つ含まれていた時
            else:
                medium_image_file_name = image_file_name.replace(
                    original_kw, medium_kw, 1
                )
                large_image_file_name = image_file_name.replace(
                    original_kw, large_kw, 1
                )

            medium_uri = "/".join([uri_excluded_file_name, medium_image_file_name])
            large_uri = "/".join([uri_excluded_file_name, large_image_file_name])
            profile_image_uri_collection["profile_image_uri"] = medium_uri
            profile_image_uri_collection["profile_image_thumbnail_uri"] = original_uri
            profile_image_uri_collection["profile_image_large_uri"] = large_uri

        return profile_image_uri_collection
