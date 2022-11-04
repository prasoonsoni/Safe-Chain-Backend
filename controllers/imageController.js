import User from '../models/User.js'
import Image from '../models/Image.js'
import encryptImage from '../scripts/imageEncryption.js'
import decryptImage from '../scripts/imageDecryption.js'
import { ObjectId } from 'mongodb'

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
        const shuffedImages = [decryptImage(images.image1, token), decryptImage(images.image2, token), decryptImage(images.image3, token), decryptImage(images.image4, token)]
        for (var i = shuffedImages.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffedImages[i];
            shuffedImages[i] = shuffedImages[j];
            shuffedImages[j] = temp;
        }
        const data = {
            image1: shuffedImages[0],
            image2: shuffedImages[1],
            image3: shuffedImages[2],
            image4: shuffedImages[3]
        }
        res.json({ success: true, message: "Images Retreived Successfully", data: data })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

const verifyImages = async (req, res) => {
    try {
        const { image1, image2, image3, image4 } = req.body
        const user = req.id
        const token = req.header('auth-token')
        const images = await Image.findOne({ user })
        if (!images) {
            return res.json({ success: false, message: "User Images Not Found" })
        }
        if (decryptImage(images.image1, token) !== image1 || decryptImage(images.image2, token) !== image2 || decryptImage(images.image3, token) !== image3 || decryptImage(images.image4, token) !== image4) {
            return res.json({ success: false, message: "Order not correct" })
        }
        res.json({ success: true, message: "Order Matched" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

export default { addImages, getImages, verifyImages }