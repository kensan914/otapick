from django.core.management.base import BaseCommand
from api import otapick


class Command(BaseCommand):
    help = (
        "Initialize database. member情報の変更の上書きにも対応しています。"
        "memberList.txtに変更を加え、コマンドを実行すれば、変更箇所だけDBに反映されます。"
    )

    def handle(self, *args, **options):
        otapick.init_group()
        otapick.init_member()
        otapick.init_member_keyword()
