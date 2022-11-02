import CryptoJS from 'crypto-js'
const decryption = (text, secret) => {
    const bytes = CryptoJS.AES.decrypt(text, secret)
    const decryptedText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    return decryptedText
}

export default decryption