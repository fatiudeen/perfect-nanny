import User from "../models/User.js"
import {getUpload, deleteUpload} from '../middlewares/upload.js'
import ErrorResponse from '../helpers/ErrorResponse.js'


//get images
export const getAvi = (req, res, next)=>{
    const readStream = getUpload(req.user.personalInformation.avi)
    readStream.pip(res).catch(err=>{
        return next(new ErrorResponse(err.message))
    })
}

export const getPhoto = (req, res, next)=>{
    const readStream = getUpload(req.params.key)
    readStream.pip(res).catch(err=>{
        return next(new ErrorResponse(err.message))
    })
}

//remove image
// export const deleteProfileImg = (req, res, next) => {
// deleteUpload(req.user.personalInformation.avi, (err, data) => {
//         if (err) {
//             return next(new ErrorResponse(err.message))
//         }
//             User.findOneAndUpdate({_id: req.user._id}, {avi: ''} ,(err, doc)=>{
//                 if (err){
//                     return next(new ErrorResponse(err.message))
//                 }else{
//                     res.status(200).json({
//                         success: true,
//                     })
//                 }
            
//             })
            
//         })
        
//     }

