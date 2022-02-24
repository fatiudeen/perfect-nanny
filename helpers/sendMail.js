import Emailing from './Emailing.js'

async function welcomeEmail(receiver, verificationLink) {
    const emailHeader = {
        subject:'Welcome to Perfect Nanny'
    }
    const emailAccount = {
        sender:'support@perfectnanny.ng',
        email:'support@perfectnanny.ng'
    }
    const mailedTo = {
        receiver,
        message:{
            header:'Welcome to Perfect Nanny!',
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
        subject:'Reset Your Password'
    }
    const emailAccount = {
        sender:'support@perfectnanny.ng',
        email:'support@perfectnanny.ng'
    }
    const mailedTo = {
        receiver,
        message:{
            header:'Welcome to Perfect Nanny!',
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