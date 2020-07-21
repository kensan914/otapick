import { getIsSmp, isMobile } from "./support";

// The only place to change
// export const DEBUG = false;
export const DEBUG = true;

export const BASE_URL = (DEBUG ? "http://192.168.99.100:8000/" : "https://otapick.com/");
export const DELAY_TIME = (DEBUG ? 300 : 0);

export const OTAPICK_BRAND_IMG_URL = "/static/img/otapick.png";
export const LOAD_IMG_URL = "/static/img/otapick_logo_back.png";
export const BACKGROUNG_IMG_URL = "/static/img/background.png";

export let MOBILE_TOP_MENU_MT;
export let NAVBAR_HEIGHT;
export let SUB_NAVBAR_HEIGHT;
export let TOTOP_BUTTON_M;
export let TOTOP_BUTTON_DIAMETER;
export const BOTTOM_NAVBAR_HEIGHT = 52;

export const setEnvConstant = () => {
    const isSmp = getIsSmp();
    MOBILE_TOP_MENU_MT = isSmp ? 48.5 : 52;
    NAVBAR_HEIGHT = isSmp ? 61 : 67;
    SUB_NAVBAR_HEIGHT = isSmp ? 55 : 60;
    TOTOP_BUTTON_M = isSmp ? 16 : (isMobile ? 32 : 48);
    TOTOP_BUTTON_DIAMETER = isSmp ? 48 : 64;
}

export const NAVBAR_LS_ZINDEX = 998;
export const SUB_NAVBAR_LS_ZINDEX = 997;
export const NAVBAR_BOTTOM_LS_ZINDEX = 999;

export const SHOW_NAVBAR_POS = 200;
export const SHOW_SUB_NAVBAR_POS = 90;

export const LONG_PRESS_TIME = 300;

export const SITE_NAME = "ヲタピック";
export const HOME_TITLE = "欅坂46・日向坂46のブログ画像を保存するなら";
export const DISCRIPTION = "『ヲタピック』は、欅坂46・日向坂46の画像や写真を効率よく閲覧・保存ができるサービスです。公式ブログやメンバーリストから推しメンの高画質な画像や写真を探して保存しましょう(PC・スマホ対応)。かっこいい画像も、かわいい画像も、保存しよう、いくらでも。#欅坂46 #日向坂46";
export const BLOGS_DISCRIPTION = "欅坂46・日向坂46の公式ブログ画像が保存できます。";
export const IMAGES_DISCRIPTION = "欅坂46・日向坂46の高画質画像が保存できます。";
export const MEMBERS_DISCRIPTION = "欅坂46・日向坂46のメンバーから高画質画像を探して保存できます。";

export const GA_TRACKING_ID = 'UA-134426000-2';