import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
dotenv.config()

const getUser = async (req, res, next) => {
    const token = req.header('auth-token')
    const password = req.header('password')
    if (!token) {
        return res.json({ success: false, message: "Authentication token is required." })
    }
    try {
        const decoded = jwt.verify(token, password)
        const { user } = decoded
        const userExists = await User.findOne({ _id: user.id })
        if (!userExists) {
            return res.json({ success: false, message: "No User Found" })
        }
        req.id = user.id
        next()
    } catch (error) {
        res.json({ success: false, message: "Secret key or Password is not valid." })
        console.log(error.message)
    }
}

export default getUser