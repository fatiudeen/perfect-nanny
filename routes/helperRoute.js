import express from 'express'
import {verify} from '../controllers/verify.js'
import { avi, upload } from '../middlewares/upload.js'
import {
    getUser,
    changePassword,
} from '../controllers/user.js'
import { getAvi, getPhoto } from '../controllers/image.js'


const router = express.Router()

router.post('/verify',avi.single('avi'), upload.array('files', 10), verify)

router.post('/edit',avi.single('avi'), upload.array('files', 10), verify)

//gets user profile & other users if queryed with _id
router.post('/user', getUser)

router.post('/password', changePassword)

router.post('/user/:key', getAvi)

router.post('/user/:key', getPhoto)


export default router