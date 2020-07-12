import { getIsSmp } from "./support";

export const BASE_URL = "http://192.168.99.100:8000/";
export const DELAY_TIME = 300;

export const OTAPICK_BRAND_IMG_URL = "/static/img/otapick.png";
export const LOAD_IMG_URL = "/static/img/otapick_logo_back.png";
export const BACKGROUNG_IMG_URL = "/static/img/background.png";

export let MOBILE_TOP_MENU_MT;
export let NAVBAR_HEIGHT;
export let SUB_NAVBAR_HEIGHT;

export const setEnvConstant = () => {
    const isSmp = getIsSmp();
    MOBILE_TOP_MENU_MT = isSmp ? 48.5 : 52;
    NAVBAR_HEIGHT = isSmp ? 61 : 67;
    SUB_NAVBAR_HEIGHT = isSmp ? 55 : 60;
}

export const NAVBAR_LS_ZINDEX = 998;
export const SUB_NAVBAR_LS_ZINDEX = 997;
export const NAVBAR_BOTTOM_LS_ZINDEX = 999;

export const SHOW_NAVBAR_POS = 200;
export const SHOW_SUB_NAVBAR_POS = 90;
