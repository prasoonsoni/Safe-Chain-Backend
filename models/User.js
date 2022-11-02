import mongoose from 'mongoose'
const {Schema} = mongoose

const UserSchema = new Schema({
    token: { type: String, required: true },
    passwords: { type: [String], required: true, default: [] },
    credit_cards: { type: [String], required: true, default: [] }
})

export default mongoose.model('User', UserSchema)
