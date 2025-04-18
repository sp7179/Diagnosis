//// filepath: d:\ChatBot\timeUtils.js

const fs = require('fs');
const timeJsPath = require.resolve('./time.js');

// on startup load last‐run time or default to 06:00
// let previousTime = (() => {
//   delete require.cache[timeJsPath];
//   const { currentTime } = require('./time.js');
//   return currentTime || '06:00';
// })();

let previousTime = "06:00";
// ─── Clock utilities & override hook ────────────────────────────────
let _timeOverride = null;

function setCurrentTime() {
  // force reload of time.js on each call so updates in time.js take effect
  const timePath = require.resolve('./time.js');
  delete require.cache[timePath];
  const { currentTime } = require('./time.js');
  _timeOverride = currentTime;
  console.log(`Current time set to: ${_timeOverride}`);
}

function getCurrentTime() {
  if (_timeOverride) return _timeOverride;
  return new Date()
    .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function persistTime(t) {
  fs.writeFileSync(
    timeJsPath,
    `module.exports = { currentTime: '${t}' };`
  );
}

module.exports = {
  previousTime,
  setCurrentTime,
  getCurrentTime,
  timeToMinutes,
  persistTime
};