// calculate a stream's SHA-256 hash
const crypto = require("crypto");
//const { resolve } = require("path");

function sha256DigestStream(read, encoding) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    read.on("error", (err) => {
      reject(err);
    });
    read.on("end", () => {
      resolve(hash.digest(encoding));
    });
    read.pipe(hash);
  });
}

// example usage
const fs = require("fs");
async function hashFile(path) {
  // create readable stream
  const read = fs.createReadStream(path);
  // calculate the hash from the stream
  const digest = await sha256DigestStream(read, "hex");
  console.log(digest);
}

hashFile("../test-files/alessandro-porri-yl4y4l86gEk-unsplash.jpg");
