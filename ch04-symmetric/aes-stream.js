// encrypt/decrypt data using aes-256-gcm and nodejs streams

const crypto = require("crypto");
const randombytes = require("util").promisify(crypto.randomBytes);

async function encrypt(key, source, destination) {
  const iv = await randombytes(12);
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    cipher.on('end', () => {
      const tag = cipher.getAuthTag()
      resolve(tag)
    })
    cipher.on('error', (err) => {
      reject(err)
    })
    // write iv to output stream (before encrypted data)
    destination.write(iv)
    // pipe the source stream into the cipher and write encrypted
    // data to the destination stream
    source.pipe(cipher).pipe(destination)
  })
}

async function decrypt(key, tag, source, destination) {
  const iv = await new Promise((resolve) => {
    // read first 12 bytes of stream
    // to get iv
    const cb = () => {
      const iv = source.read(12)
      source.off('readable', cb)
      return resolve(iv)
    }
    source.on('readable', cb)
  })
  if (!iv) {
    throw Error('iv is null')
  }
  // Decipher the source stream
  return new Promise((resolve, reject) => {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)
    decipher.on('end', () => {
      resolve()
    })
    decipher.on('error', (err) => {
      reject(err)
    })
    // pipe source stream through decipher and
    // write it to destination
    source.pipe(decipher).pipe(destination)
  })
}

// immediately invoke encryption/decryption
const fs = require('fs');
(async function() {
  const key = await randombytes(32)
  console.log('Key: ', key.toString("base64"))
  const testFile = "../test-files/alessandro-porri-yl4y4l86gEk-unsplash.jpg"
  let tag 
  // encrypt
  {
    const inFile = fs.createReadStream(testFile)
    const outFile = fs.createWriteStream(testFile + '.enc')
    tag = await encrypt(key, inFile, outFile)
    console.log('File was encrypted... Authentication Tag: ', tag.toString("base64"))
  }
  // decrypt
  {
    const inFile = fs.createReadStream(testFile + '.enc')
    const outFile = fs.createWriteStream(testFile + '.orig')
    await decrypt(key, tag, inFile, outFile)
    console.log('File was decrypted successfully')
  }
})()