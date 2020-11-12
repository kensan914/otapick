import oauth2 as oauth
from otapick.lib.constants import TWITTER_CK_AUTH, TWITTER_CS_AUTH, OTAPICK_URL_LOOP_BACK


request_token_url = 'https://twitter.com/oauth/request_token'
access_token_url = 'https://twitter.com/oauth/access_token'
authenticate_url = 'https://twitter.com/oauth/authorize'
callback_url = OTAPICK_URL_LOOP_BACK + '/accounts/twitter/login/callback/'


def get_request_token():
    try:
        consumer = oauth.Consumer(key=TWITTER_CK_AUTH, secret=TWITTER_CS_AUTH)
        client = oauth.Client(consumer)

        # reqest_token を取得
        resp, content = client.request('{}?&oauth_callback={}'.format(request_token_url, callback_url))
        request_token = dict(parse_qsl(content.decode('utf-8')))
        return request_token['oauth_token']
    except Exception as e:
        print(e)
        return


def parse_qsl(url):
    param = {}
    for i in url.split('&'):
        _p = i.split('=')
        param.update({_p[0]: _p[1]})
    return param


def get_access_token(oauth_token, oauth_verifier):
    consumer = oauth.Consumer(key=TWITTER_CK_AUTH, secret=TWITTER_CS_AUTH)
    token = oauth.Token(oauth_token, oauth_verifier)

    client = oauth.Client(consumer, token)
    resp, content = client.request("https://api.twitter.com/oauth/access_token",
                                   "POST", body="oauth_verifier={0}".format(oauth_verifier))
    return content


def get_authorize_uri():
    # request tokenを取得
    request_token = get_request_token()
    if request_token is None:
        return

    # request_tokenを認証endpointにつけて認証urlを生成する。
    authorize_uri = '{}?oauth_token={}'.format(authenticate_url, request_token)
    return authorize_uri
