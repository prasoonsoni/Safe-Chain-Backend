const crypto = require('crypto')

const decryptImage = (encryptedData, token) => {
    const algorithm = "aes-256-cbc"
    const initVector = crypto.randomBytes(16)
    const decipher = crypto.createDecipheriv(algorithm, token, initVector);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData
}

module.exports = decryptImage
