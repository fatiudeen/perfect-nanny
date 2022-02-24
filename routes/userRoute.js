import express from 'express'
import {verify} from '../controllers/verify.js'
import find from '../controllers/find.js'
import {preference} from '../controllers/preference.js'
import { avi, upload } from '../middlewares/upload.js'
import {
    getUser,
    changePassword,
} from '../controllers/user.js'
import { getAvi, getPhoto } from '../controllers/image.js'

const router = express.Router()

router.post('/verify',avi.single('avi'), upload.array('files', 10), verify)

router.patch('/edit', avi.single('avi'), upload.array('files', 10), verify)

router.get('/find', find)

router.post('/preference', preference)

//gets user profile & other users if queryed with _id
router.get('/user', getUser)

router.patch('/password', changePassword)

router.get('/user/:key', getAvi)

router.get('/user/:key', getPhoto)

export default router