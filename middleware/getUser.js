require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const getUser = async (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        return res.json({ success: false, message: "Authentication token is required." })
    }
    try {
        const tokenVerification = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ token })
        if (!user) {
            return res.json({ success: false, message: "No User Found" })
        }
        req.id = user._id
        next()
    } catch (error) {
        res.json({ success: false, message: "Authentication token is not valid." })
        console.log(error.message)
    }
}

module.exports = getUser