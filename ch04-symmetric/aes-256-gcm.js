// encrypt/decrypt data using aes-256-gcm cipher 

const crypto = require("crypto");
const randombytes = require("util").promisify(crypto.randomBytes);

async function encrypt(key, plaintext) {
  const iv = await randombytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  // get auth tag to decrypted text can be verified against it
  // to prove it hasn't been tampered with
  // this will trigger an exception as tag can't
  // be authenticated against message
  // const tag = new Buffer.from("foo")
  const tag = cipher.getAuthTag()
  
  
  return Buffer.concat([iv, tag, encrypted]);
}

function decrypt(key, message) {
  const iv = message.slice(0, 12);
  const tag = message.slice(12, 28)
  const ciphertext = message.slice(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag)
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