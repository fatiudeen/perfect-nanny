import dotenv from 'dotenv'
dotenv.config()
import multer from 'multer'
import { S3Client } from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'

const bucket = process.env.AWS_BUCKET_NAME 
const region = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretKey = process.env.AWS_SECRET_KEY

const s3 = new S3Client({
        region,
        accessKey,
        secretKey
})

const storage = new multerS3({
    s3,
    bucket,
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
})

const fileFilter =(req, res, cb)=>{
    if (file.mimetype ==='image/jpeg' || file.mimetype === 'image/png' ){
        cb(null, true)
    }else{
        cb(err, false)
    }
}

function getUpload(key) {
    const params = {
        key,
        bucket
    }
    return s3.getObject(params)
    .createReadStream()
}

function deleteUpload(key) {
    const params = {
        key,
        bucket
    }
    return s3.deleteObject(params)
    .promise()
}

const avi =  multer({storage: storage},
    {fileFilter: fileFilter}
    )

const upload = multer({
    storage: storage
}, {fileFilter: fileFilter}
)

export{
    avi,
    upload,
    getUpload,
    deleteUpload
}


