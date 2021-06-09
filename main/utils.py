import otapick
from config import settings


def geneMaintenanceMessage():
    return "実施中" if otapick.checkIsMaintaining(settings.BASE_DIR) else ""
