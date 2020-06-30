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
export let device;

export const setUserAgent = () => {
  const result = UAParser();
  if (typeof result.device.type == "undefined") {
    device = "pc";
  } else {
    device = "mobile";
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