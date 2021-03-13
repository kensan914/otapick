from config import settings

### Version ###
VERSION = '4.3.0'

### URL ###
OTAPICK_FQDN = '192.168.11.3:8000' if settings.DEBUG else 'otapick.com'
OTAPICK_URL = 'http://{}/'.format(
    OTAPICK_FQDN) if settings.DEBUG else 'https://{}/'.format(OTAPICK_FQDN)
# OTAPICK_URL_LOOP_BACK = 'http://127.0.0.1:8000' if settings.DEBUG else 'https://otapick.com'

IMAGE_NOT_FOUND_URL = '/static/img/logo_rectangle_margin.png'  # image not found
# image not found ver orderly
IMAGE_NOT_FOUND_ORDERLY_URL = '/static/img/logo_square_margin.png'
OTAPICK_LOGO = '/static/img/logo_square_margin.png'  # otapick logo (square)
WATCH_MORE_IMG_URL = '/static/img/watch_more.png'  # watch more button's background
TWITTER_ADS_URLS = [
    '/static/img/twitter_ads/1_01.png',
    '/static/img/twitter_ads/1_02.png',
    '/static/img/twitter_ads/1_03.png',
    '/static/img/twitter_ads/1_04.png',
    '/static/img/twitter_ads/1_05.png',
    '/static/img/twitter_ads/1_06.png',
]

### Key ###
VIEW_KEY = "5JxxqfpXH8sF_zQMw4xg"
DOWNLOAD_KEY = "fMHSr_sp6PYhsfZ4YSAt"


### twitter ###
TWITTER_CK = "EndyyIz6105OLMVZLj48whPTl"
TWITTER_CS = "6UcaWCKZSk9Z5a4HRwYoyVU4e2Kucmrt3bFdg7SP5q2c5iTMyB"
TWITTER_AT = "1227261179380162560-cQdyzZXEqUaW7i2kmUHa5ImE9mNJWv"
TWITTER_AS = "ulqsDBaJG8eeb7kRZ4DOWpsG6XXVOJvi5YXHF64uC4RaV"

### twitter auth ###
TWITTER_CK_AUTH = "VIW4HJoCkbQL7gbu9UKQKCfVN"
TWITTER_CS_AUTH = "AOliVAgYbE75enqZ8PkGG1lDGnPNq2enT0u5Ih2etsL3cuPv0q"
