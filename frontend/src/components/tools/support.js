import { SHOW_NAVBAR_POS, SHOW_SUB_NAVBAR_POS } from './env';

// ex)URLJoin('http://www.google.com', 'a', undefined, '/b/cd', undifined, '?foo=123', '?bar=foo'); => 'http://www.google.com/a/b/cd/?foo=123&bar=foo' 
export const URLJoin = (...args) => {
  args = args.filter(n => n !== undefined);
  for (let i = args.length - 1; i >= 0; i--) {
    if (args[i].startsWith('?')) continue;
    if (!args[i].endsWith('/')) {
      args[i] += '/';
      break;
    }
  }
  return args.join('/').replace(/[\/]+/g, '/').replace(/^(.+):\//, '$1://').replace(/^file:/, 'file:/').replace(/\/(\?|&|#[^!])/g, '$1').replace(/\?/g, '&').replace('&', '?')
}

export const scrollTop = () => {
  return Math.max(
    window.pageYOffset,
    document.documentElement.scrollTop,
    document.body.scrollTop);
}

export const getGroup = (groupID) => {
  let group = "";
  if (groupID == 1) group = "keyaki";
  if (groupID == 2) group = "hinata";
  return group;
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

export const generateWavesVals = () => {
  let wavesVals = new Array(4);
  for (let i = 0; i < wavesVals.length; i++) wavesVals[i] = getRandomIntInclusive(-30, 150);
  return wavesVals;
}

export const shortenNum = (num) => {
  num = Number(num);
  if (num < 1000) return num;
  else if (1000 <= num && num < 10000) {
    let num_min = num / 1000;
    num_min = Math.floor(num_min * 10) / 10
    return num_min + '千';
  } else if (10000 <= num && num < 100000) {
    let num_min = num / 10000;
    num_min = Math.floor(num_min * 10) / 10
    return num_min + '万';
  } else if (100000 <= num && num < 1000000) {
    let num_min = num / 10000;
    num_min = Math.floor(num_min)
    return num_min + '万';
  } else if (1000000 <= num && num < 10000000) {
    let num_min = num / 1000000;
    num_min = Math.floor(num_min * 10) / 10
    return num_min + 'M';
  } else if (10000000 <= num && num < 100000000) {
    let num_min = num / 1000000;
    num_min = Math.floor(num_min)
    return num_min + 'M';
  } else if (100000000 <= num && num < 1000000000) {
    let num_min = num / 100000000;
    num_min = Math.floor(num_min * 10) / 10
    return num_min + '億'
  } else if (1000000000 <= num && num < 10000000000) {
    let num_min = num / 100000000;
    num_min = Math.floor(num_min)
    return num_min + '億'
  } else if (10000000000 <= num) {
    return "-";
  }
}


const UAParser = require('ua-parser-js')
export let isMobile = true; // スマホ・タブレット: true, PC: false
export let isSmp = true; // スマホ: true, タブレット・PC: false

export const setUserAgent = () => {
  const result = UAParser();
  if (typeof result.device.type == "undefined") {
    isMobile = false;
    isSmp = false;
  } else {
    isMobile = true;
    if (result.device.type === "tablet") {
      isSmp = false;
    } else {
      isSmp = true;
    }
  }
}

// isSmpがsetされる前に値が必要なとき
export const getIsSmp = () => {
  const result = UAParser();
  if (typeof result.device.type == "undefined") {
    return false;
  } else {
    if (result.device.type === "tablet") {
      return false;
    } else {
      return true;
    }
  }
}

// isMobileがsetされる前に値が必要なとき
export const getIsMobile = () => {
  const result = UAParser();
  if (typeof result.device.type == "undefined") {
    return false;
  } else {
    return true;
  }
}

export const generateKeepAliveName = (key) => {
  if (typeof key == "undefined") {
    return "keepAliveInit";
  } else {
    return key;
  }
}

export const generateKeepAliveNameInfo = (key) => {
  if (typeof key == "undefined") {
    return "keepAliveInitInfo";
  } else {
    return key + "info";
  }
}

export const generateAlt = (group, writerName, type) => {
  let groupName;
  if (group === "keyaki") {
    groupName = "欅坂46";
  } else if (group === "hinata") {
    groupName = "日向坂46";
  }
  if (type === "thumbnail") {
    return `${writerName}(${groupName})のブログのサムネイル画像`;
  } else if (type === "member") {
    return `${writerName}(${groupName})のアーティスト写真`;
  } else {
    return `${writerName}(${groupName})のブログ画像`;
  }
}

export const generateRandomSeed = () => Math.floor(Math.random() * (2 ** 32));


// 初期ページのlocation.key
export let initLocationKey;
export const setInitLocationKey = (key) => {
  if (typeof initLocationKey == "undefined") {
    initLocationKey = key;
  }
}


// URLのparamsが数値かチェック、違ければnotfoundへ遷移。
// 全角数字: false
export const checkMatchParams = (history, ...args) => {
  // const pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
  for (const arg of args) {
    if (typeof arg !== "undefined") {
      if (isNaN(arg)) {
        history.replace("/notFound");
        break;
      }
    }
  }
}


// searchDownやmenuを選択したときの背景の影(lockScreen)
// searchDownやmenuで異なるidを設定する
export const lockScreen = (id, zIndex = 999) => {
  if (document.getElementById(`lock-screen-wrapper_${id}`) === null) {
    let lockScreenWrapper = document.createElement("div");
    lockScreenWrapper.setAttribute("id", `lock-screen-wrapper_${id}`);
    lockScreenWrapper.classList.add("lock-screen-wrapper");
    lockScreenWrapper.setAttribute("style", `z-index: ${zIndex}`);
    document.body.appendChild(lockScreenWrapper);
  }
}
export const unLockScreen = (id) => {
  const lockScreenWrapper = document.getElementById(`lock-screen-wrapper_${id}`);
  if (lockScreenWrapper !== null) lockScreenWrapper.remove();
}

export const setBodyPadding = (pxVal) => {
  document.body.setAttribute("style", `padding-top: ${pxVal}px`);
}


// scrollの監視
export const watchCurrentPosition = (startPos) => {
  const currentPos = scrollTop();
  let result = { isShowNBShadow: null, isShowNB: null, isShowSubNB: null, startPos: currentPos };

  if (currentPos === 0) {
    result.isShowNBShadow = false;
    result.isShowNB = true;
    result.isShowSubNB = false;
  } else {
    if (currentPos > startPos) { // down
      if (currentPos < SHOW_NAVBAR_POS) {
        result.isShowNB = true;
        result.isShowNBShadow = true;
      } else if (currentPos >= SHOW_NAVBAR_POS) {
        if (isMobile) {
          result.isShowNBShadow = false;
          result.isShowNB = false;
        } else {
          result.isShowNBShadow = true;
          result.isShowNB = true;
        }
      }
    } else if (startPos > currentPos) { // up
      result.isShowNB = true;
      result.isShowNBShadow = true;
    }

    if (currentPos < SHOW_SUB_NAVBAR_POS) {
      result.isShowSubNB = false;
    } else result.isShowSubNB = true;
  }
  return result;
}


// event handler
export const documentScrollHandler = e => {
  // スクロール無効
  e.preventDefault();
}