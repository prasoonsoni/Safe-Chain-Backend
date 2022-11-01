const CryptoJS = require('crypto-js')
const encryptImage = (text, secret) => {
    const ciphertext = CryptoJS.AES.encrypt(text, secret).toString()
    return ciphertext
}

module.exports = encryptImage

