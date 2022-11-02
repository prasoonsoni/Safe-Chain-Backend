import CryptoJS from 'crypto-js'
const encryption = (text, secret) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(text), secret).toString()
    return ciphertext
}

export default encryption
