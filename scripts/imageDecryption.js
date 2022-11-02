import CryptoJS from 'crypto-js'
const decryptImage = (text, secret) => {
    const bytes = CryptoJS.AES.decrypt(text, secret)
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8)
    return decryptedText
}

export default decryptImage
