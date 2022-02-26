import dotenv from 'dotenv'
dotenv.config()
import multer from 'multer'
import aws from 'aws-sdk'
import multerS3 from 'multer-s3'

const bucket = process.env.AWS_BUCKET_NAME 
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

aws.config.update({
    secretAccessKey,
    accessKeyId,
    region
  })
const s3 = new aws.S3()

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

// function getUpload(key) {
//     const params = {
//         Key: key,
//         Bucket: bucket
//     }
//     return s3.getObject(params)
//     .createReadStream()
// }

function deleteUpload(key) {
    let params
    if(typeof key == 'object'){
        //array of objects
        params = {
            Bucket: bucket,
            delete: arrayOfObjects,
            Quiet: true
        }
    } else {
     params = {
        key: key,
        Bucket: bucket
    }}
    return s3.deleteObject(params)
    .promise()
}

const upload = multer({
    storage: storage
}, {fileFilter: fileFilter}
)

export{
    upload,
    deleteUpload,
}


