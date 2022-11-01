const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const storeFiles = require('./web3.storage/upload.js')
const connectToDatabase = require('./database/connection.js')
app.use(cors())
app.use(express.json())
connectToDatabase()

app.get('/', async(req, res) => {
    res.send('<center><h1>Welcome to Cognition Project Backend</h1>')
})
app.use('/user', require('./routes/userRoutes'))
app.use('/images', require('./routes/imageRoutes'))
app.use('/password', require('./routes/passwordRoutes'))
app.use('/creditcard', require('./routes/creditCardRoutes'))

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})