import { getIsSmp, isMobile } from "./utils";


export const DEBUG = NODE_ENV === "development";
export const BASE_URL = DEBUG ? "http://127.0.0.1:8000/" : "https://otapick.com/";
export const DELAY_TIME = DEBUG ? 0 : 0;

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

// Global Adsense
export const GA_TRACKING_ID = "UA-134426000-2";
export const DATA_AD_CLIENT = "ca-pub-3712313672767903";
export const DATA_AD_SLOT_SQUARE = "3963767991";
export const DATA_AD_SLOT_LANDSCAPE = "8177403224";
export const ADS_INTERVAL = 50;
export const ADS_INTERVAL_MORE = 100;
export const ADS_INDEX = 8;

// groups 改名時は、ここを変更するだけでよい
export const GROUPS = {
    "1": {
        id: "1",
        name: "櫻坂46",
        key: "sakura",
        blogUrl: "https://sakurazaka46.com/s/s46/diary/blog?ima=0000",
        blogUrlExample: "https://sakurazaka46.com/s/s46/diary/blog?ima=0000",
        topUrl: "https://sakurazaka46.com/s/s46/?ima=0000",
        domain: "sakurazaka46.com",
        isActive: true,
    },
    "3": {
        id: "3",
        name: "欅坂46",
        key: "keyaki",
        blogUrl: "https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000",
        blogUrlExample: "https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000",
        topUrl: "https://www.keyakizaka46.com/s/k46o/?ima=0000",
        domain: "keyakizaka46.com",
        isActive: false,
    },
    "2": {
        id: "2",
        name: "日向坂46",
        key: "hinata",
        blogUrl: "https://www.hinatazaka46.com/s/official/diary/member?ima=0000",
        blogUrlExample: "https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000",
        topUrl: "https://www.hinatazaka46.com/s/official/?ima=0000",
        domain: "hinatazaka46.com",
        isActive: true,
    },
};

export const SITE_NAME = "ヲタピック";
export const HOME_TITLE = `${GROUPS["1"].name}・${GROUPS["2"].name}・${GROUPS["3"].name}のブログ画像を保存するなら`;
export const DISCRIPTION = `『${SITE_NAME}』は、${GROUPS["1"].name}・${GROUPS["2"].name}・${GROUPS["3"].name}の画像や写真を効率よく閲覧・保存ができるサービスです。公式ブログやメンバーリストから推しメンの高画質な画像や写真を探して保存しましょう(PC・スマホ対応)。かっこいい画像も、かわいい画像も、保存しよう、いくらでも。#${GROUPS["1"].name} #${GROUPS["2"].name}`;
export const BLOGS_DISCRIPTION = `${GROUPS["1"].name}・${GROUPS["2"].name}・${GROUPS["3"].name}の公式ブログ画像が保存できます。`;
export const IMAGES_DISCRIPTION = `${GROUPS["1"].name}・${GROUPS["2"].name}・${GROUPS["3"].name}の高画質画像が保存できます。`;
export const MEMBERS_DISCRIPTION = `${GROUPS["1"].name}・${GROUPS["2"].name}・${GROUPS["3"].name}のメンバーから高画質画像を探して保存できます。`;
