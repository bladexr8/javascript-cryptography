// encrypt using a hybrid encryption scheme
// 1. Use symmetric encryption to encrypt
// 2. Use RSA encryption to encrypt the symmetric key

const crypto = require('crypto');
const fs = require('fs');

// Promisify the fs.readFile method
const readFile = require('util').promisify(fs.readFile);

function rsaEncrypt(publicKey, plainText) {
  return crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256'
  },
  plainText
  )
}

function rsaDecrypt(privateKey, message) {
  return crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256'
  },
  message
  )
}