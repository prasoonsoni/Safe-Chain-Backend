import encryption from '../scripts/encryption.js'
import decryption from '../scripts/decryption.js'
import User from '../models/User.js'
import * as IPFS from 'ipfs'
const node = await IPFS.create()

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
        const results = await node.add(encrpytedData)
        console.log(results)
        if (!results.cid) {
            return res.json({ success: false, message: "Error Saving Credit Card Details. Try Again Later." })
        }
        const update = await User.updateOne({ _id:req.id }, { $push: { credit_cards: results.cid } })
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
        const user = await User.findOne({ _id:req.id })
        if (!user) {
            return res.json({ success: false, message: "No user available." })
        }
        const cids = user.credit_cards
        const data = []
        for (var i = 0; i < cids.length; i++) {
            const stream = node.cat(cids[i])
            const decoder = new TextDecoder()
            let text = ''
            for await (const chunk of stream) {
                text += decoder.decode(chunk, { stream: true })
            }
            if (!text) {
                return res.json({ success: false, message: "Error getting data" })
            }
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

// Password functions
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
        const results = await node.add(encrpytedData)
        console.log(results)
        if (!results.cid) {
            return res.json({ success: false, message: "Error Saving Password. Try Again Later." })
        }
        const update = await User.updateOne({ token: token }, { $push: { passwords: results.cid } })
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
            const stream = node.cat(cids[i])
            const decoder = new TextDecoder()
            let text = ''
            for await (const chunk of stream) {
                text += decoder.decode(chunk, { stream: true })
            }
            if (!text) {
                return res.json({ success: false, message: "Error getting data" })
            }
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

export default { saveCreditCard, getCreditCards, deleteCreditCard, savePassword, getPassword, deletePassword }