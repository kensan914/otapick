import uuid
from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import _user_has_perm
from django.db import models
from django.utils import timezone
from api.models.main.models import Group, Member


class AccountManager(BaseUserManager):
    use_in_migration = True

    def _create_user(self, **fields):
        if not "email" in fields:
            raise ValueError("The given email must be set")
        if not "password" in fields:
            raise ValueError("The given password must be set")
        fields["email"] = self.normalize_email(fields["email"])
        user = self.model(**fields)
        user.set_password(fields["password"])
        user.save(using=self._db)
        return user

    def create_user(self, **fields):
        fields.setdefault("is_staff", False)
        fields.setdefault("is_superuser", False)
        return self._create_user(**fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff==True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser==True.")

        return self._create_user(email=email, password=password, **extra_fields)


class Account(AbstractBaseUser):
    class Meta:
        db_table = "account"
        verbose_name = verbose_name_plural = "アカウント"
        ordering = ["-date_joined"]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(verbose_name="ユーザネーム", max_length=15, unique=True)
    email = models.EmailField(verbose_name="メールアドレス", max_length=255, unique=True)
    name = models.CharField(verbose_name="名前", max_length=50, blank=True)
    profile_image_uri = models.URLField(verbose_name="プロフィール画像(200*200)", blank=True)
    profile_image_thumbnail_uri = models.URLField(
        verbose_name="プロフィール画像(48*48)", blank=True
    )
    profile_image_large_uri = models.URLField(
        verbose_name="プロフィール画像(400*400)", blank=True
    )

    fav_groups = models.ManyToManyField(Group, verbose_name="推しグループ", blank=True)
    fav_member_sakura = models.ForeignKey(
        Member,
        verbose_name="櫻坂46推しメン",
        on_delete=models.PROTECT,
        related_name="account_fav_sakura",
        null=True,
    )
    fav_member_hinata = models.ForeignKey(
        Member,
        verbose_name="日向46推しメン",
        on_delete=models.PROTECT,
        related_name="account_fav_hinata",
        null=True,
    )

    # 無制限値: -1. 下記に定数として宣言(MAX_FAVORITE_IMAGES_NUM_UNLIMITED_SIGN)
    max_favorite_images_num = models.IntegerField(verbose_name="お気に入り画像Max", default=50)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(verbose_name="登録日", default=timezone.now)

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def user_has_perm(user, perm, obj):
        return _user_has_perm(user, perm, obj)

    def has_perm(self, perm, obj=None):
        return _user_has_perm(self, perm, obj=obj)

    def has_module_perms(self, app_label):
        return self.is_superuser

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.name

    objects = AccountManager()


MAX_FAVORITE_IMAGES_NUM_UNLIMITED_SIGN = -1
