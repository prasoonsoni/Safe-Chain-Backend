const mongoose = require('mongoose')
const { Schema } = mongoose

const ImageSchema = new Schema({
    user: { type: mongoose.Types.ObjectId },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
})

module.exports = mongoose.model('Image', ImageSchema)