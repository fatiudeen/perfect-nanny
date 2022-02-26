import User from '../models/User.js'
import errorResponse from '../helpers/ErrorResponse.js'
import {deleteUpload} from '../middlewares/upload.js'

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

//edit img// delete img if err

export const verify = (req, res, next)=>{
    if (req.user.role === 'Helper'){
        if (req.user.verified == 'Verified'){
            console.log(req.files)

            // allow helpers to update their personal information
            let data = {}
            let pics = [];

            !req.body.address ? false : Object.assign(data,{'personalInformation.location.address': req.body.address});
            !req.body.area ? false : Object.assign(data,{'personalInformation.location.area': req.body.area});
            !req.body.lga ? false : Object.assign(data,{'personalInformation.location.lga': req.body.lga});
            !req.body.state ? false : Object.assign(data,{'personalInformation.location.state': req.body.state});
            
            !req.age ? false : Object.assign(data,{'personalInformation.age': req.body.age});

            (req.files?.files?.length > 0 ) 
                ? req.files.files.map(file=>{
                    pics.push({
                        key: file.key,
                        url: file.location
                    })
                })
                : false;
            
            pics.length == 0 ? false : Object.assign(data,{'personalInformation.photos': pics})
            !req.maritalStatus ? false : Object.assign(data,{'personalInformation.maritalStatus': req.body.maritalStatus})
            !req.typeOfHelper ? false : Object.assign(data,{'personalInformation.typeOfHelper': req.body.nannyType})
            !req.education ? false : Object.assign(data,{'personalInformation.education':  req.body.education})
            !req.yearsOfExperience ? false : Object.assign(data,{'personalInformation.yearsOfExperience':  req.body.yearsOfExperience})
            !req.body.workingHoursFrom ? false : Object.assign(data,{'personalInformation.workingHours.from': req.body.workingHoursFrom})
            !req.body.workingHoursTo ? false : Object.assign(data,{'personalInformation.workingHours.to': req.body.workingHoursTo});

            (req.files?.avi?.length > 0 ) 
            ? Object.assign(data,{'personalInformation.avi': {key: req.files.avi[0].key, url: req.files.avi[0].location}})
            : false;

            //fix picture replacement

            User.findByIdAndUpdate(req.user._id, data,{new: true})
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
        
            try {
                let data = {}
                let location = {}
                let workingHours = {}
                let pics = []
                
                location.address = req.body.address
                location.area = req.body.area
                location.lga = req.body.lga
                location.state = req.body.state
                data.age = req.body.age;
    
                req.files.files.map(file=>{
                    pics.push({
                        key: file.key,
                        url: file.location
                    })
                });
                data.photos = pics
                data.maritalStatus = req.body.maritalStatus
                data.typeOfHelper = req.body.nannyType
                data.education = req.body.education
                data.yearsOfExperience = req.body.yearsOfExperience
                workingHours.from = req.body.workingHoursFrom
                workingHours.to = req.body.workingHoursTo
                data.avi = {key: req.files.avi[0].key, url: req.files.avi[0].location}
                data.location = location
                data.workingHours = workingHours
    
    
                if (pics.length < 2){
                    return next(new errorResponse('Upload at least 2 pictures of your building',400))
                }
    
                User.findByIdAndUpdate(req.user._id, {personalInformation: data, verified: 'Pending'},{new: true})
                    .then(doc=>{
                        if(data.location.state.localeCompare('Kaduna', 'en', { sensitivity: 'base' }) != 0){
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
            } catch (error) {
                deleteUpload(data.avi).catch(err=>{
                    throw new err
                })
                deleteUpload(pics).catch(err=>{
                    throw new err
                })
                return next(error)
            }

        }
    }else if (req.user.role === 'User'){

        if (req.user.verified == 'Verified'){

            // allow users to update their personal information
            let data = {}
            let kids = {}
            let pics = [];

            !req.body.address ? false : Object.assign(data,{'personalInformation.location.address': req.body.address});
            !req.body.area ? false : Object.assign(data,{'personalInformation.location.area': req.body.area});
            !req.body.lga ? false : Object.assign(data,{'personalInformation.location.lga': req.body.lga});
            !req.body.state ? false : Object.assign(data,{'personalInformation.location.state': req.body.state});
            !req.age ? false : Object.assign(data,{'personalInformation.age': req.body.age});
            !req.occupation ? false : Object.assign(data,{'personalInformation.occupation': req.body.occupation});

            (!req.body.numberOfKids) 
                ? false : (kids.number = req.body.numberOfKids) 
                && (kids.age = req.body.ageOfKids) 
                && (kids.class = req.body.classOfKids);

            (Object.entries(kids) > 0) ? Object.assign(data,{'personalInformation.kids': kids}): false;

            (req.files?.files?.length > 0 ) 
            ? req.files.files.map(file=>{
                pics.push({
                    key: file.key,
                    url: file.location
                })
            })
            : false;
            pics.length == 0 ? false : Object.assign(data,{'personalInformation.photos': pics})
            !req.maritalStatus ? false : Object.assign(data,{'personalInformation.maritalStatus': req.body.maritalStatus});

            (req.files?.avi?.length > 0 ) 
            ? Object.assign(data,{'personalInformation.avi': {key: req.files.avi[0].key, url: req.files.avi[0].location}})
            : false;

            //fix picture replacement 

            User.findByIdAndUpdate(req.user._id, data, {new: true})
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

        } else if (req.user.verified == 'Not Verified'){
        
            try {
                let data = {}
                let location = {}
                let kids = {}
                let pics = []

                location.address = req.body.address
                location.area = req.body.area
                location.lga = req.body.lga
                location.state = req.body.state
                data.age = req.body.age

                data.occupation = req.body.occupation;
                (!req.body.numberOfKids) 
                    ? false : (kids.number = req.body.numberOfKids || null) 
                    && (kids.age = req.body.ageOfKids || null) 
                    && (kids.class = req.body.classOfKids || null) ;
                
                
                req.files.files.map(file=>{
                    pics.push({
                        key: file.key,
                        url: file.location
                    })
                });
                data.homePictures = pics
                data.maritalStatus = req.body.maritalStatus
                data.avi = {key: req.files.avi[0].key, url: req.files.avi[0].location}
                data.location = location
                data.kids = kids

                if (pics.length < 5){
                    return next(new errorResponse('Upload at least 5 pictures of your building',400))
                }


                User.findByIdAndUpdate(req.user._id, {personalInformation: data, verified: 'Pending'},{new: true})
                    .then(doc=>{
                        if(data.location.state.localeCompare('Kaduna', 'en', { sensitivity: 'base' }) != 0){
                            return res.status(200).json({
                                success: true,
                                message: 'sorry! this service is exclusive to residents of kaduna state'
                            })
                        }
                        res.status(201).json({
                            success: true,
                            doc
                        })
                    }).catch(err=>{

                        return next(new errorResponse(err.message, 500))
                    })
            } catch (error) {
                deleteUpload(data.avi).catch(err=>{
                    throw new err
                })
                deleteUpload(pics).catch(err=>{
                    throw new err
                })
                return next(error)
            }
        }
    } else {

        User.findByIdAndUpdate(req.params.id, {verified: 'Verified'}, {new: true})
        .then(doc=>{
            res.status(200).json({
                success: true,
                doc})
        }).catch(err=>{
            return next(new errorResponse(err.message, 500))
        })
    }
}

