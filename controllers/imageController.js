const User = require('../models/User')
const Image = require('../models/Image')
const encryptImage = require('../scripts/imageEncryption')
const decryptImage = require('../scripts/imageDecryption')
const { ObjectId } = require('mongodb')

const addImages = async (req, res) => {
    try {
        const user = req.id
        const { image1, image2, image3, image4 } = req.body
        const token = req.header('auth-token')
        const userPresent = await User.findOne({ _id: user })
        if (!userPresent) {
            return res.json({ success: false, message: "No User Found" })
        }
        const imagesAdded = await Image.findOne({ user })
        if (imagesAdded) {
            return res.json({ success: false, message: "Images Already Added" })
        }
        const addImages = await Image.create({
            user: user,
            image1: encryptImage(image1, token),
            image2: encryptImage(image2, token),
            image3: encryptImage(image3, token),
            image4: encryptImage(image4, token),
        })
        if (!addImages) {
            return res.json({ success: false, message: "Images not added" })
        }
        res.json({ success: true, message: "Images added successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

const getImages = async (req, res) => {
    try {
        const user = new ObjectId(req.id)
        const token = req.header('auth-token')
        const images = await Image.findOne({ user })
        if (!images) {
            return res.json({ success: false, message: "User Images Not Found" })
        }
        const data = {
            image1: decryptImage(images.image1, token),
            image2: decryptImage(images.image2, token),
            image3: decryptImage(images.image3, token),
            image4: decryptImage(images.image4, token)
        }
        res.json({ success: true, message: "Images Retreived Successfully", data: data })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

module.exports = { addImages, getImages }