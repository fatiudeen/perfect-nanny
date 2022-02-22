import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import morgan from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import db from './config/db.js'
import errorHandler from './middlewares/errorHandler.js'
import _protected from './middlewares/protected.js'
import adminRoutes from './routes/adminRoute.js'
import helperRoute from './routes/helperRoute.js'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Perfect Nanny",
      version: "0.1.0",
      description:
        "This is the documentation of Perfect Nanny API",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    contact: {
      name: "Shehu-Fatiudeen Lawal",
      url: "https://www.github.com/fatiudeen",
      email: "shehufatiudeen@gmail.com"
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server"
      },
    ],
  },
  apis: ["./routes/*.js"],
}

const specs = swaggerJsdoc(options)

//middlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))
app.use(errorHandler)

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

//database connection
db()

const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
)
