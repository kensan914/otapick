from config import settings

### Version ###
VERSION = '4.3.11'

### URL ###
OTAPICK_COM = 'otapick.com'
OTAPICK_FQDN = '192.168.11.46:8000' if settings.DEBUG else OTAPICK_COM
# admin.otapick.comは非対応
OTAPICK_URL = 'http://{}/'.format(
    OTAPICK_FQDN) if settings.DEBUG else 'https://{}/'.format(OTAPICK_FQDN)

IMAGE_NOT_FOUND_URL = '/static/img/logo_rectangle_margin.png'  # image not found
IMAGE_NOT_FOUND_WIDTH = 1000
IMAGE_NOT_FOUND_HEIGHT = 666

# image not found ver orderly
IMAGE_NOT_FOUND_ORDERLY_URL = '/static/img/logo_square_margin.png'
OTAPICK_LOGO = '/static/img/logo_square_margin.png'  # otapick logo (square)
WATCH_MORE_IMG_URL = '/static/img/watch_more.png'  # watch more button's background

### ADS FROM OTAPICK ###
OTAPICK_TWITTER_URL = 'https://twitter.com/otapick/'
TWITTER_ADS_URLS = [
    '/static/img/twitter_ads/v2/01.png',
    '/static/img/twitter_ads/v2/02.png',
    '/static/img/twitter_ads/v2/03.png',
    '/static/img/twitter_ads/v2/04.png',
    '/static/img/twitter_ads/v2/05.png',
    '/static/img/twitter_ads/v2/06.png',
]
TWITTER_ADS_WIDTH = 700
TWITTER_ADS_HEIGHT = 1000

### Key ###
VIEW_KEY = '5JxxqfpXH8sF_zQMw4xg'
DOWNLOAD_KEY = 'fMHSr_sp6PYhsfZ4YSAt'


### twitter ###
TWITTER_CK = 'EndyyIz6105OLMVZLj48whPTl'
TWITTER_CS = '6UcaWCKZSk9Z5a4HRwYoyVU4e2Kucmrt3bFdg7SP5q2c5iTMyB'
TWITTER_AT = '1227261179380162560-cQdyzZXEqUaW7i2kmUHa5ImE9mNJWv'
TWITTER_AS = 'ulqsDBaJG8eeb7kRZ4DOWpsG6XXVOJvi5YXHF64uC4RaV'

### twitter auth ###
TWITTER_CK_AUTH = '0QJ2ntQSMJmevPXnSHhu2mtEp'
TWITTER_CS_AUTH = 'TIYFPcNM9YiBN18bPVeFP7lItP6Kd3jlGyM0igs2YbKEhuKtJG'

### slack webhooks ###
SLACK_WEBHOOKS_OTAPICK_BOT_URL = settings.SLACK_WEBHOOKS_OTAPICK_BOT_URL


### OGP ###
SITE_NAME = 'ヲタピック'
HOME_TITLE = '櫻坂46・日向坂46のブログ画像を保存するなら'
DESCRIPTION = f'『{SITE_NAME}』は、櫻坂46・日向坂46の画像や写真を効率よく閲覧・保存ができるサービスです。公式ブログやメンバーリストから推しメンの高画質な画像や写真を探して保存しましょう(PC・スマホ対応)。かっこいい画像も、かわいい画像も、保存しよう、いくらでも。#櫻坂46 #日向坂46'
