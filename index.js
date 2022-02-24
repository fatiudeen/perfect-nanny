import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import morgan from 'morgan'
import cors from 'cors'
import db from './config/db.js'
import {errorHandler} from './middlewares/error.js'
import _protected from './middlewares/protected.js'
import adminRoutes from './routes/adminRoute.js'
import helperRoute from './routes/helperRoute.js'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))

//Routes
app.use('/api/auth', authRoute)
app.use('/api/admin', _protected('Admin'), adminRoutes)
app.use('/api/user',_protected('User'), userRoute)
app.use('/api/helper', _protected('Helper'), helperRoute)
app.use('*',(req,res)=>{
  res.status(500).json({
      status:'Sorry Route does not exists',
  })
})
app.use(errorHandler)

//database connection
db()

const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
)
