const crypto = require("crypto");

const supported_ciphers = crypto.getCiphers();

//console.log(supported_ciphers);

console.log("Supported Ciphers:");
for (let cipher of supported_ciphers) {
  console.log(cipher);
}
