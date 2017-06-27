AVAVerify = require("./AVAVerify");

function jsVerifySuite(...args) {
  return new AVAVerify(...args);
}

jsVerifySuite.AVAVerify = AVAVerify;

module.exports = jsVerifySuite;
