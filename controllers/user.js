import notification from '../models/notification.js'
import User from '../models/User.js'
import ErrorResponse from '../helpers/ErrorResponse.js' 

//MANAGE USER DATA
// get user data 
export const getUser = (req, res, next)=>{
    
    //by _id
    //by req.user.id
    //by role
    //by {verified: 'Pending'}
    let data ={};
    (req.user.isAdmin === true && Object.keys(req.query).length > 0 )
    ? Object.assign(data, req.query) : req.user.isAdmin === true 
    ? false: (req.user.isAdmin === false && Object.keys(req.query)[0] == '_id') 
    ? Object.assign(data, req.query) : (data._id =req.user._id)

    //console.log(data)
    User.find(data)
    //User.find(Object.entries(data)[0] ?? null)
    .then(doc =>{ 
        if(!doc){
            return next (new ErrorResponse('Not Found', 404))
        }
        res.status(200).json({success: true, doc})
    }).catch(err =>{
        return next (new ErrorResponse(err.message))
    })
}


//CHANGE PASSWORD
export const changePassword = (req, res, next)=>{
    let pass = req.body.oldPassword
    let newPass = req.body.newPassword
    let data = {}

    if(newPass.length < 8 ){
        return next (new ErrorResponse('password length must be more than 8', 411))
    }

        if (req.body.newPassword != req.body.confirmPassword){
            return next (new ErrorResponse('confirm the new password', 406))
        }


        User.findById(req.user._id).select('+password').then(async (doc)=>{
            data.doc = doc
            data.match = await doc.comparePasswords(pass)
        }).then(nil=>{
            if(!data.match){
                    return next (new ErrorResponse('incorrect old password', 406))
            }
            let doc = data.doc
            doc.password = req.body.newPassword
            doc.save().then(
            res.status(200).json({success: true})
        )
            })
        .catch(err =>{
            return next (new ErrorResponse(err.message))
        })
    
}


//get notification
export const getNotif = (req, res, next)=>{

    notification.find({treated: false}, (err, doc)=>{
        if (err) {
            return next (new ErrorResponse(err.message))
        }
        doc.treated = true
        doc.save()
        .catch(err=>{
            return next (new ErrorResponse(err.message))
        })
        res.status(201).json({success: true, doc})
    })
} 

