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