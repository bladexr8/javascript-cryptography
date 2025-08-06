// encrypt/decrypt data using aes-256-cbc cipher 

const crypto = require("crypto");
const randombytes = require("util").promisify(crypto.randomBytes);

async function encrypt(key, plaintext) {
  const iv = await randombytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, encrypted]);
}

function decrypt(key, message) {
  const iv = message.slice(0, 16);
  const ciphertext = message.slice(16);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([
    decipher.update(ciphertext, "utf8"),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

// use immediately invoked function so we can run async code
(async () => {
  const plaintext = 'Hello World!'
  const key = await randombytes(32)
  console.log('Key: ', key.toString('base64'))
  const encrypted = await encrypt(key, plaintext)
  console.log('Encrypted Message: ', encrypted.toString("base64"))
  const decrypted = decrypt(key, encrypted)
  console.log('Decrypted Message: ', decrypted)
})()