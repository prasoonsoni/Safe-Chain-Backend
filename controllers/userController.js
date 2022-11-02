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
        const data = {
            user: {
                password: hashPassword,
                created_at: Date.now()
            }
        }
        const token = jwt.sign(data, process.env.JWT_SECRET_KEY)
        const user = await User.create({
            token: token,
            passwords: [],
            credit_cards: []
        })
        if(!user) {
            return res.json({success:false, message:"Error creating user"})
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const { user } = decoded
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials." })
        }
        res.json({ success: true, message: "Login Successful", token: token })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Token is not valid" })
    }
}

export default { createUser, loginUser }
