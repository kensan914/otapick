import { getIsSmp, isMobile } from "./utils";

// eslint-disable-next-line no-undef
export const DEBUG = NODE_ENV === "development";
export const FQDN = window.env.fqdn;
export const BASE_URL = DEBUG ? `http://${FQDN}/api/` : `https://${FQDN}/api/`;
export const DELAY_TIME = DEBUG ? 0 : 0;

export const OTAPICK_BRAND_IMG_URL = "/static/img/logotitle.png";
export const LOAD_IMG_URL = "/static/img/otapick_logo_back.png";
export const BACKGROUND_IMG_URL = "/static/img/background.png";

//---------- URLパスによる振る舞い変更 ----------//
// show〇〇Urls(〇〇を表示する)  or  dontShow〇〇Urls(〇〇を表示しない) <= 404ページ、つまり該当しなかった場合どうしたいかで選択。
// 前方一致("/"を除く)で、必ず一文字目に"/"をつける。詳細ページ(image, blog)は、"image/", "blog/"とすることで一覧ページとの衝突を防ぐ。
// パフォーマンス向上のため、頻繁にアクセスするページ順に。
//---------------------------------------------//
// mobileのサブNavbarを表示しないページのurl.
export const dontShowSubNavbarUrls = ["/users"];
// toTopボタンを表示するページのurl
export const showToTopButtonUrls = [
  "/",
  "/blogs",
  "/images",
  "/image",
  "/members",
  "/users",
  "/search/group/blog",
  "/search/member/blog",
];
// footerを表示しないページのurl.
export const dontShowFooterUrls = [
  "/",
  "/blogs",
  "/images",
  "/image",
  "/users",
  "/search/group/blog",
  "/search/member/blog",
];

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
  TOTOP_BUTTON_M = isSmp ? 16 : isMobile ? 32 : 48;
  TOTOP_BUTTON_DIAMETER = isSmp ? 48 : 64;
};

export const NAVBAR_LS_ZINDEX = 998;
export const SUB_NAVBAR_LS_ZINDEX = 997;
export const NAVBAR_BOTTOM_LS_ZINDEX = 999;

export const SHOW_NAVBAR_POS = 200;
export const SHOW_SUB_NAVBAR_POS = 90;

export const LONG_PRESS_TIME = 300;

// Global AdSense
export const GA_TRACKING_ID = "UA-134426000-2";
export const DATA_AD_CLIENT = "ca-pub-3712313672767903";
export const DATA_AD_SLOT_SQUARE = "3963767991";
export const DATA_AD_SLOT_LANDSCAPE = "8177403224";
export const ADS_INTERVAL = 50;
export const ADS_INTERVAL_MORE = 100;
export const ADS_INDEX = 8;

import bookmarkSakuraAnimationData from "../../static/lottie/bookmark_sakura.json";
import bookmarkHinataAnimationData from "../../static/lottie/bookmark_hinata.json";
import bookmarkKeyakiAnimationData from "../../static/lottie/bookmark_keyaki.json";
// groups 改名時は、ここを変更するだけでよい
export const GROUPS = {
  1: {
    id: 1,
    name: "櫻坂46",
    key: "sakura",
    blogUrl: "https://sakurazaka46.com/s/s46/diary/blog?ima=0000",
    blogUrlExample: "https://sakurazaka46.com/s/s46/diary/blog?ima=0000",
    topUrl: "https://sakurazaka46.com/s/s46/?ima=0000",
    domain: "sakurazaka46.com",
    isActive: true,
    bookmarkAnimationData: bookmarkSakuraAnimationData,
    color: "#f9c1cf",
  },
  3: {
    id: 3,
    name: "欅坂46",
    key: "keyaki",
    blogUrl: "https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000",
    blogUrlExample: "https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000",
    topUrl: "https://www.keyakizaka46.com/s/k46o/?ima=0000",
    domain: "keyakizaka46.com",
    isActive: false,
    bookmarkAnimationData: bookmarkKeyakiAnimationData,
    color: "#4be057",
  },
  2: {
    id: 2,
    name: "日向坂46",
    key: "hinata",
    blogUrl: "https://www.hinatazaka46.com/s/official/diary/member?ima=0000",
    blogUrlExample:
      "https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000",
    topUrl: "https://www.hinatazaka46.com/s/official/?ima=0000",
    domain: "hinatazaka46.com",
    isActive: true,
    bookmarkAnimationData: bookmarkHinataAnimationData,
    color: "#5de7ff",
  },
};

export const SITE_NAME = "ヲタピック";
export const HOME_TITLE = `${GROUPS["1"].name}・${GROUPS["2"].name}のブログ画像を保存するなら`;
export const DESCRIPTION = `『${SITE_NAME}』は、${GROUPS["1"].name}・${GROUPS["2"].name}の画像や写真を効率よく閲覧・保存ができるサービスです。公式ブログやメンバーリストから推しメンの高画質な画像や写真を探して保存しましょう(PC・スマホ対応)。かっこいい画像も、かわいい画像も、保存しよう、いくらでも。#${GROUPS["1"].name} #${GROUPS["2"].name}`;
export const BLOGS_DESCRIPTION = `${GROUPS["1"].name}・${GROUPS["2"].name}の公式ブログ画像が保存できます。`;
export const IMAGES_DESCRIPTION = `${GROUPS["1"].name}・${GROUPS["2"].name}の高画質画像が保存できます。`;
export const MEMBERS_DESCRIPTION = `${GROUPS["1"].name}・${GROUPS["2"].name}のメンバーから高画質画像を探して保存できます。`;
