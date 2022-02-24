import User from '../models/User.js'
import notification from '../models/notification.js'
import errorResponse from '../helpers/ErrorResponse.js'


/**
 * this module allow users set information about the type of helpers they want
 */

export default (req, res, next) =>{

    let data = {}
    !data.maritalStatus ? false : data.maritalStatus = req.body.maritalStatus
    !data.typeOfHelper ? false : data.typeOfHelper = req.body.nannyType
    !data.education ? false : data.education = req.body.education
    !data.yearsOfExperience ? false : data.yearsOfExperience = req.body.yearsOfExperience
    !data.workingHours.from ? false : data.workingHours = req.body.workingHoursFrom
    !data.workingHours.to ? false : data.workingHours = req.body.workingHoursTo
    !data.age.from ? false : data.age = req.body.ageFrom
    !data.age.to ? false : data.age = req.body.ageTo

    if(Object.entries(data) == 0){
        return
    }

    if (data.typeOfHelper === 'Others'){
        let info = req.body.OtherInfo
        notification.create({sender: req.user._id, type: 'custom helper', message: {email: req.user.email, message: info}})
        .then(
            res.status(200).json({
            success: true,
            message:'we have recieved your specification, sit tight.. we will get back to you as soon as possible'
        })
        ).catch(err=>{
            return next(new errorResponse(err.message, 500))  
        })
    }

    User.findByIdAndUpdate(req.user_id, {personalInformation: data})
        .then(doc=>{
            res.status(200).json({
                success: true,
                doc
            })
        }).catch(err=>{
            return next(new errorResponse(err.message, 500))
        })
}
