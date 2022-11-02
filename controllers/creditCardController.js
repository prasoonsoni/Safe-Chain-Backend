import encryption from '../scripts/encryption.js'
import decryption from '../scripts/decryption.js'
import User from '../models/User.js'
import * as IPFS from 'ipfs'
const saveCreditCard = async (req, res) => {
    try {
        const { number, expiry_date, holder_name, cvv, bank_name, token } = req.body
        const data = {
            number,
            expiry_date,
            holder_name,
            cvv,
            bank_name
        }
        const encrpytedData = encryption(data, token)
        // Adding to IPFS
        const node = await IPFS.create()
        const results = node.add(encrpytedData)
        
        if (!file[0].hash) {
            return res.json({ success: false, message: "Error Saving Credit Card Details. Try Again Later." })
        }
        const update = await User.updateOne({ token: token }, { $push: { credit_cards: file[0].hash } })
        if (!update.acknowledged) {
            return res.json({ success: false, message: "Error Saving Credit Card Details. Try Again Later." })
        }
        res.json({ success: true, message: "Credit Card saved successfully", data: encrpytedData })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

const getCreditCards = async (req, res) => {
    try {
        const { token } = req.body
        const user = await User.findOne({ token: token })
        if (!user) {
            return res.json({ success: false, message: "No user available." })
        }
        const cids = user.credit_cards
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
        res.json({ success: true, message: "Credit Card Details retrieved successfully", data: data })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

const deleteCreditCard = async (req, res) => {
    try {
        const { token, id } = req.body
        const update = await User.updateOne({ token: token }, { $pull: { credit_cards: id } })
        if (!update.acknowledged) {
            return res.json({ success: false, message: "Error deleting Credit Card Details. Try Again Later." })
        }
        res.json({ success: true, message: "Credit Card Details deleted successfully" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

export default { saveCreditCard, getCreditCards, deleteCreditCard }