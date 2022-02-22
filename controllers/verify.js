import User from '../models/User.js'
import errorResponse from '../helpers/ErrorResponse.js'


/**
 * this module verifies personal information for both users and helpers.
 * after setting the initial data, its allows modification
 *  
 * notifies non kaduna residents that the service is only available in kaduna
 * 
 * sends notification to the admin if a custom helper is selected
 * 
 * allows admins to set users as verified
 * 
 */


export default (req, res, next)=>{
    if (req.user.role === 'Helper'){
        if (req.user.verified == 'Verified'){

            // allow helpers to update their personal information
            let data = {}
            !req.body.address ? false : data.location.address = req.body.address
            !req.body.area ? false : data.location.area = req.body.area
            !req.body.lga ? false : data.location.lga = req.body.lga
            !req.body.state ? false : data.location.state = req.body.state
            !req.age ? false : data.age = req.body.age
            (Object.entries(req.files).length > 0 ) 
                ? data.photos = req.files.map(file=>{ file.key})
                : false
            !req.maritalStatus ? false : data.maritalStatus = req.body.maritalStatus
            !req.typeOfHelper ? false : data.typeOfHelper = req.body.nannyType
            !req.education ? false : data.education = req.body.education
            !req.yearsOfExperience ? false : data.yearsOfExperience = req.body.yearsOfExperience
            !req.workingHours ? false : data.workingHours = req.body.workingHours
            (Object.entries(req.file).length > 0 ) 
                ? false : data.avi = req.file.key
        
            User.findByIdAndUpdate(req.user_id, {personalInformation: data})
                .then(doc=>{
                    res.status(200).json({
                        success: true,
                        doc
                    })
                }).catch(err=>{
                    return next(new errorResponse(err.message, 500))
                })

        } else if (req.user.verified == 'Pending'){
            return next(new errorResponse('Cannot edit your personal information until you are verified',400))

        } else {

            if (Object.entries(data.homePictures) != 2 || (Object.entries(req.file).length > 0 )){
                return next(new errorResponse('Upload at 2 pictures of yourself and a profile picture',400))
            }

            let data = {}
            data.location.address = req.body.address
            data.location.area = req.body.area
            data.location.lga = req.body.lga
            data.location.state = req.body.state
            data.age = req.body.age
            (Object.entries(req.files).length > 0 ) 
                ? data.photos = req.files.map(file=>{ file.key})
                : false
            data.maritalStatus = req.body.maritalStatus
            data.typeOfHelper = req.body.nannyType
            data.education = req.body.education
            data.yearsOfExperience = req.body.yearsOfExperience
            data.workingHours = req.body.workingHours
            data.avi = req.file.key

            User.findByIdAndUpdate(req.user_id, {personalInformation: data, verified: 'Pending'})
                .then(doc=>{
                    if(data.location.state != 'Kaduna'){
                        return res.status(200).json({
                            success: true,
                            message: 'sorry! this service is exclusive to residents of kaduna state'
                        })
                    }
                    res.status(200).json({
                        success: true,
                        doc
                    })
                }).catch(err=>{
                    return next(new errorResponse(err.message, 500))
                })
        }
    }else if (req.user.role === 'User'){

        if (req.user.verified == 'Verified'){

            // allow users to update their personal information
            let data = {}
            !req.body.address ? false : data.location.address = req.body.address
            !req.body.area ? false : data.location.area = req.body.area
            !req.body.lga ? false : data.location.lga = req.body.lga
            !req.body.state ? false : data.location.state = req.body.state
            !req.age ? false : data.age = req.body.age
            !req.occupation ? false : data.occupation = req.body.occupation
            (!req.body.numberOfKids || req.body.numberOfKids >= 1) 
                ? (data.kids.number = req.body.numberOfKids) 
                && (data.kids.age = req.body.ageOfKids) 
                && (data.kids.class = req.body.classOfKids) : null
            (Object.entries(req.files).length > 0 ) 
                ? data.homePictures = req.files.map(file=>{ file.key})
                : false
            !req.maritalStatus ? false : data.maritalStatus = req.body.maritalStatus
            (Object.entries(req.file).length > 0 ) 
                ? false : data.avi = req.file.key
        
            User.findByIdAndUpdate(req.user_id, {personalInformation: data})
                .then(doc=>{
                    res.status(200).json({
                        success: true,
                        doc
                    })
                }).catch(err=>{
                    return next(new errorResponse(err.message, 500))
                })

        } else if (req.user.verified == 'Pending'){
            return next(new errorResponse('Cannot edit your personal information until you are verified',400))

        } else {

            if(Object.entries(req.file).length > 0 ){
                return next(new errorResponse('Upload a profile picture',400))
            }

            let data = {}
            data.location.address = req.body.address
            data.location.area = req.body.area
            data.location.lga = req.body.lga
            data.location.state = req.body.state
            data.age = req.body.age
            data.occupation = req.body.occupation
            (!req.body.numberOfKids || req.body.numberOfKids >= 1) 
                ? (data.kids.number = req.body.numberOfKids) 
                && (data.kids.age = req.body.ageOfKids) 
                && (data.kids.class = req.body.classOfKids) : null
            (Object.entries(req.files).length > 0 ) 
                ? data.homePictures = req.files.map(file=>{ file.key})
                : false
            data.maritalStatus = req.body.maritalStatus
            data.avi = req.file.key


            if (Object.entries(data.homePictures) > 5){
                return next(new errorResponse('Upload at least 5 pictures of your building',400))
            }


            User.findByIdAndUpdate(req.user_id, {personalInformation: data, verified: 'Pending'})
                .then(doc=>{
                    if(data.location.state != 'Kaduna'){
                        return res.status(200).json({
                            success: true,
                            message: 'sorry! this service is exclusive to residents of kaduna state'
                        })
                    }
                    res.status(200).json({
                        success: true,
                        doc
                    })
                }).catch(err=>{
                    return next(new errorResponse(err.message, 500))
                })
        }
    } else {
        User.findByIdAndUpdate(req.params.id, {verified: 'Pending'})
        .then(doc=>{
            res.status(200).json({
                success: true,
                doc})
        }).catch(err=>{
            return next(new errorResponse(err.message, 500))
        })
    }
}

