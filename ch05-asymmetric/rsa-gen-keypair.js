// generate an RSA key pair
// and write them to PEM files

// equivalent to the following openssl commands
// $ openssl genrsa -out private.pem 4096 
// $ openssl rsa -in private.pem -outform PEM -pubout -out public.pem

const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const generateKeyPair = util.promisify(crypto.generateKeyPair);
const writeFile = util.promisify(fs.writeFile);

(async function() {
  console.log('Generating Keys...')
  const keyPair = await generateKeyPair('rsa', {
    modulusLength: 4096
  })
  const privateKey = keyPair.privateKey.export({
    type: 'pkcs8',
    format: 'pem'
  })
  await writeFile('private.pem', privateKey)
  const publicKey = keyPair.publicKey.export({
    type: 'spki',
    format: 'pem'
  })
  await writeFile('public.pem', publicKey)
})()

/*(async function() {
  console.log('Generating Key...')
})()*/