import express from 'express'
import {verify} from '../controllers/verify.js'
import find from '../controllers/find.js'
import {preference} from '../controllers/preference.js'
import {upload
} from '../middlewares/upload.js'
import {
    getUser,
    changePassword,
} from '../controllers/user.js'

const router = express.Router()

router.post('/verify', upload.fields([
    { name: 'avi', maxCount: 1 },
    { name: 'files', maxCount: 5 }
  ]), verify)

router.patch('/edit', upload.fields([
    { name: 'avi', maxCount: 1 },
    { name: 'files', maxCount: 5 }
  ]), verify)

router.get('/find', find)

router.post('/preference', preference)

//gets user profile & other users if queryed with _id
router.get('/user', getUser)

router.patch('/password', changePassword)

export default router