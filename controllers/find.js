import User from '../models/User.js'
import ErrorResponse from '../helpers/ErrorResponse.js'

/**
 * finds the most compactable top 5 helpers
 */

export default (req, res, next) =>{
    let users =[]
    let score = 0

    User.find({role: 'Helper', 'personalInformation.typeOfHelper': req.user.preference.typeOfHelper})
    .then(doc=>{
        doc.map(user=>{

            user.personalInformation.location.lga == req.user.preference.lga ? score = score +7 : false;
            (user.personalInformation.age >= req.user.preference.age.from 
            && user.personalInformation.age <= req.user.preference.age.to)   
                ? score = score +7 : false;
            user.personalInformation.maritalStatus == req.user.preference.maritalStatus ? score = score +6 : false;
            user.personalInformation.education == req.user.preference.education ? score = score +5 : false;
            user.personalInformation.yearsOfExperience == req.user.preference.yearsOfExperience ? score = score +4 : false;
            (user.personalInformation.workingHours >= req.user.preference.workingHours.from 
            && user.personalInformation.workingHours == req.user.preference.workingHours.to )
            ? score = score +10 : false;
            user.personalInformation.typeOfHelper == req.user.preference.typeOfHelper ? score = score +10
            : user.personalInformation.typeOfHelper == 'Both' || req.user.preference.typeOfHelper == 'Both' 
            ? score = score +10 : false;

            

            // let chores = user.personalInformation.typeOfChores.filter(element=> {
            //     req.user.preference.typeOfChores.includes(element)
            // })
            // score = score + (chores.length *3)
            
            users.push({score, user})
            
        })
    }).catch(err=>{
        return next(new ErrorResponse(err.message))
    })

    let resullt = users.sort((a,b) =>{
        return a.score - b.score
    })//.slice(0,5)
        console.log(resullt)

    res.status(200).json({
        success: true,
        resullt
    })
}

