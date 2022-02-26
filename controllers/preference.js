import User from '../models/User.js'
import notification from '../models/notification.js'
import errorResponse from '../helpers/ErrorResponse.js'


/**
 * this module allow users set information about the type of helpers they want
 */

export const preference = (req, res, next) =>{

    let data = {}


    !req.maritalStatus ? false : Object.assign(data,{'personalInformation.maritalStatus': req.body.maritalStatus})
    !req.typeOfHelper ? false : Object.assign(data,{'personalInformation.typeOfHelper': req.body.nannyType})
    !req.education ? false : Object.assign(data,{'personalInformation.education':  req.body.education})
    !req.education ? false : Object.assign(data,{'personalInformation.education':  req.body.education})
    !req.body.workingHoursFrom ? false : Object.assign(data,{'personalInformation.workingHours.from': req.body.workingHoursFrom})
    !req.body.workingHoursTo ? false : Object.assign(data,{'personalInformation.workingHours.to': req.body.workingHoursTo});
    !req.yearsOfExperience ? false : Object.assign(data,{'personalInformation.yearsOfExperience':  req.body.yearsOfExperience})
    !req.ageFrom ? false : Object.assign(data,{'personalInformation.age.from': req.body.ageFrom});
    !req.ageTo ? false : Object.assign(data,{'personalInformation.age.to': req.body.ageTo});

    if(data == {}){
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

    User.findByIdAndUpdate(req.user._id, data, {new: true})
        .then(doc=>{
            res.status(200).json({
                success: true,
                doc
            })
        }).catch(err=>{
            return next(new errorResponse(err.message, 500))
        })
}
