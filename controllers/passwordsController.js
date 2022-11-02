import encryption from '../scripts/encryption.js'
import decryption from '../scripts/decryption.js'
import User from '../models/User.js'
const savePassword = async (req, res) => {
    try {
        const { name, website, username, password, description, token } = req.body
        const data = {
            name,
            website,
            username,
            password,
            description
        }
        const encrpytedData = encryption(data, token)
        const buffer = new Buffer(encrpytedData)
        const file = await ipfs.files.add(buffer)
        if (!file[0].hash) {
            return res.json({ success: false, message: "Error Saving Password. Try Again Later." })
        }
        const update = await User.updateOne({ token: token }, { $push: { passwords: file[0].hash } })
        if (!update.acknowledged) {
            return res.json({ success: false, message: "Error Saving Password. Try Again Later." })
        }
        res.json({ success: true, message: "Password saved successfully", data: encrpytedData })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

const getPassword = async (req, res) => {
    try {
        const { token } = req.body
        const user = await User.findOne({ token: token })
        if (!user) {
            return res.json({ success: false, message: "No user available." })
        }
        const cids = user.passwords
        const data = []
        for (var i = 0; i < cids.length; i++) {
            const files = await ipfs.files.get(cids[i])
            if (!files[0].content.toString('utf8')) {
                return res.json({ success: false, message: "Error getting data" })
            }
            const text = files[0].content.toString('utf8')
            const decryptedData = decryption(text, token)
            decryptedData.id = cids[i]
            data.push(decryptedData)
        }
        res.json({ success: true, message: "Password retrieved successfully", data: data })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

const deletePassword = async (req, res) => {
    try {
        const { token, id } = req.body
        const update = await User.updateOne({ token: token }, { $pull: { passwords: id } })
        if (!update.acknowledged) {
            return res.json({ success: false, message: "Error deleting Credit Card Details. Try Again Later." })
        }
        res.json({ success: true, message: "Password deleted successfully" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

export default { savePassword, getPassword, deletePassword }