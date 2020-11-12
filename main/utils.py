import otapick
from config import settings


def geneMaintenanceMessage():
    return 'メンテナンス中' if otapick.checkIsMaintaining(settings.BASE_DIR) else ''
