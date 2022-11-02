import CryptoJS from 'crypto-js'
const encryptImage = (text, secret) => {
    const ciphertext = CryptoJS.AES.encrypt(text, secret).toString()
    return ciphertext
}

export default encryptImage

