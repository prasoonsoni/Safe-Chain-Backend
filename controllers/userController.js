import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
dotenv.config()

const createUser = async (req, res) => {
    try {
        const { password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const user = await User.create({
            passwords: [],
            credit_cards: []
        })
        const data = {
            user: {
                id: user._id,
                password: hashPassword,
                created_at: Date.now()
            }
        }
        const token = jwt.sign(data, password)
        if (!user) {
            return res.json({ success: false, message: "Error creating user" })
        }
        res.json({ success: true, message: "Account created successfully", token: token })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Internal Server Error Occured. Try Again Later." })
    }
}

const loginUser = async (req, res) => {
    try {
        const { password, token } = req.body
        const decoded = jwt.verify(token, password)
        const { user } = decoded
        console.log(user.id)
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials." })
        }
        const userPresent = await User.findOne({ _id: user.id })
        if (!userPresent) {
            return res.json({ success: false, message: "User not found" })
        }
        res.json({ success: true, message: "Login Successful", token: token })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Token or Password is not valid" })
    }
}

export default { createUser, loginUser }
