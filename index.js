import express from 'express'
import connectToDatabase from'./database/connection.js'
import cors from 'cors'
// Importing Routes
import userRoutes from './routes/userRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import passwordRoutes from './routes/passwordRoutes.js'
import creditCardRoutes from './routes/creditCardRoutes.js'

const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
connectToDatabase()

app.get('/', async(req, res) => {
    res.send('<center><h1>Welcome to Cognition Project Backend</h1>')
})
app.use('/user', userRoutes)
app.use('/images', imageRoutes)
app.use('/password', passwordRoutes)
app.use('/creditcard', creditCardRoutes)

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})