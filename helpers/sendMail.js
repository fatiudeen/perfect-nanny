import Emailing from './Emailing.js'

async function welcomeEmail(receiver, verificationLink) {
    const emailHeader = {
        subject:'Welcome to RDLand'
    }
    const emailAccount = {
        sender:'hello@rdland.io',
        email:'hello'
    }
    const mailedTo = {
        receiver,
        message:{
            header:'Welcome to RDLand Closed Alpha!😀🤩',
            verificationLink,
            body: `
            Please Use this Link to Complete your Registration

            `
        }
    }
    let email = new Emailing(emailHeader,emailAccount,mailedTo);
   return  email.sendEmail()}

///fo
async function resetPasswordEmail (receiver, verificationLink) {
    const emailHeader = {
        subject:'Qualification Link'
    }
    const emailAccount = {
        sender:'hello@rdland.io',
        email:'hello'
    }
    const mailedTo = {
        receiver,
        message:{
            header:'Welcome to RDLand Closed Alpha!😀🤩',
            verificationLink,
            body: `
            Please Use this Link to Reset your Password

            `
        }
    }
    let email = new Emailing(emailHeader,emailAccount,mailedTo);
    return email.sendEmail()
}

export {
    welcomeEmail,
    resetPasswordEmail,
}