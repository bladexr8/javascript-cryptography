// calculate a string's SHA-256 hash
const crypto = require("crypto");

function sha256Digest(message, encoding) {
  return crypto.createHash("sha256").update(message).digest(encoding);
}

// returns a buffer
console.log(sha256Digest("Hello World!"));
// returns a hex string
console.log(sha256Digest("Hello World!", "hex"));
// returns a base64 string
console.log(sha256Digest("Hello World!", "base64"));
