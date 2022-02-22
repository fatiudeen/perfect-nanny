import express from 'express'
import verify from '../controllers/verify.js'
import find from '../controllers/find.js'
import preference from '../controllers/preference.js'
import { avi, upload } from '../middlewares/upload.js'
import {
    getUser,
    changePassword,

} from '../controllers/user.js'

import { getAvi, getPhoto } from '../controllers/image.js'

const router = express.Router()

router.post('/verify',avi, upload, verify)

router.post('/edit', avi, upload, verify)

router.post('/find', find)

router.post('/preference', preference)

//gets user profile & other users if queryed with _id
router.post('/user', getUser)

router.post('/password', changePassword)

router.post('/user/:key', getAvi)

router.post('/user/:key', getPhoto)

export default router