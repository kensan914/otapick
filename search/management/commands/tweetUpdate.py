from django.core.management.base import BaseCommand
import tweepy
from datetime import date, timedelta, datetime
from search.models import Blog
from config import settings
import pytz
import emoji


class Command(BaseCommand):
    help = 'tweet update information.'

    def add_arguments(self, parser):
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2). default:None')

    def handle(self, *args, **options):
        if options['group'] != 1 and options['group'] != 2 or options['group'] is None:
            print('groupID', options['group'], 'is not supported.')
            quit()

        new_posts = self.filter_blog_1day(options['group'])
        if len(new_posts) <= 0:
            quit()

        CK = "EndyyIz6105OLMVZLj48whPTl"
        CS = "6UcaWCKZSk9Z5a4HRwYoyVU4e2Kucmrt3bFdg7SP5q2c5iTMyB"
        AT = "1227261179380162560-cQdyzZXEqUaW7i2kmUHa5ImE9mNJWv"
        AS = "ulqsDBaJG8eeb7kRZ4DOWpsG6XXVOJvi5YXHF64uC4RaV"

        auth = tweepy.OAuthHandler(CK, CS)
        auth.set_access_token(AT, AS)
        api = tweepy.API(auth)

        text = self.create_text(new_posts, options['group'])
        media_ids = self.create_media_ids(api, new_posts)

        try:
            api.update_status(status=text, media_ids=media_ids)
        except Exception as e:
            print(e)

    # blog 1 day before current time
    def filter_blog_1day(self, group_id):
        today = date.today()
        yesterday = today - timedelta(days=1)

        dt_now = datetime.now()
        dt_now_1secago = dt_now - timedelta(seconds=1)
        yesterday_time = dt_now.strftime('%H:%M:%S')
        today_time = dt_now_1secago.strftime('%H:%M:%S')

        start_str = str(yesterday) + ' ' + yesterday_time
        end_str = str(today) + ' ' + today_time

        start = datetime.strptime(start_str, '%Y-%m-%d %H:%M:%S').replace(tzinfo=pytz.timezone('Asia/Tokyo'))
        end = datetime.strptime(end_str, '%Y-%m-%d %H:%M:%S').replace(tzinfo=pytz.timezone('Asia/Tokyo'))

        new_posts = Blog.objects.filter(post_date__range=(start, end), writer__belonging_group__group_id=group_id).order_by('-post_date', 'order_for_simul')
        return new_posts

    def create_text(self, new_posts, group_id):
        text = ''
        if group_id == 1:
            text = emoji.emojize(':rainbow:', use_aliases=True)
        elif group_id == 2:
            text = emoji.emojize(':sunny:', use_aliases=True)

        text += '本日の坂道ブログ更新情報(' + str(len(new_posts)) + '件)'

        text += emoji.emojize(':rainbow:', use_aliases=True) + '\n\n'

        for new_post in new_posts[:4]:
            text += '「' + self.shorten_text(new_post.title, max_length=10) + '」 #' + new_post.writer.full_kanji + '\n'

        if len(new_posts) > 4:
            text += 'etc…\n'

        text += '\n' + emoji.emojize(':arrow_double_down:', use_aliases=True) + 'もっと見る'\
                + emoji.emojize(':arrow_double_down:', use_aliases=True) + '\n'

        if group_id == 1:
            text += 'otapick.com/search/group/blog/1/\n\n#欅坂46'
        elif group_id == 2:
            text += 'otapick.com/search/group/blog/2/\n\n#日向坂46'
        return text

    def create_media_ids(self, api, new_posts):
        file_names = []
        media_ids = []

        for new_post in new_posts[:4]:
            media_path = new_post.thumbnail.picture.url
            file_name = settings.BASE_DIR + media_path
            file_names.append(file_name)

        for file_name in file_names:
            res = api.media_upload(file_name)
            media_ids.append(res.media_id)

        return media_ids

    def shorten_text(self, txt, max_length):
        if len(txt) > max_length:
            txt = txt[:max_length]
            txt += '…'
        return txt
