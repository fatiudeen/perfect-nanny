import nodeMailer from 'nodemailer'


class Emailing {
    constructor(emailHeader,emailAccount,mailedTo) {
        this.emailType = emailType;
        this.emailAccount = emailAccount;
        this.mailedTo = mailedTo;
        this.emailHeader = emailHeader;
        this.emailOptions =  {
            from: `"${this.emailAccount.sender}" <${this.emailAccount.email}@rdland.io>`,
            to:   this.mailedTo.receiver,
            subject:   this.emailHeader.subject,
            text:   this.mailedTo.message.body,
            html: this.emailBody(this.mailedTo),
            attachments:[
            ]
        }
    }
///EMAIL BODY FOR ALL EMAILS
    emailBody = function (toWhomData) {
return  (`
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
            <title>email</title>
            <link rel="preconnect" href="https://fonts.gstatic.com">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Lekton:ital,wght@0,400;0,700;1,400&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400;1,500;1,700&display=swap');

            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                color: #2b2b41;
                font-family: 'Lekton','Roboto', sans-serif;
                text-align: center;
            }
            .container{
                padding: 15px;
                background-color: #f7f7f7;
            }
            .mail-body{
                padding: 10px;
                background-color: white;
            }
            .h4{
                font-size: 1.8rem;
            }
            .h6{
                font-size: 1.45rem;
            }
            .p{
                font-size: 1.6rem;
            }
            .mgT1{
                margin-top: 1rem;
            }
            .mgT2{
                margin-top: 2rem;
            }
            .mgT4{
                margin-top: 4rem;
            }
            .sub-h{
                font-size: 1.8rem ;
                font-weight: bold;
            }
            .main-img{
                width: 100%;
            }
            .pdv1{
                padding: 1rem 0;
            }
            .bottomg_greet{
                background-color: lavender;
                float:right;
                padding: 1rem;
                border-radius: 1.5rem;
                width: 100%;
            }

            .btn {
                color: white;
                text-decoration: none;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 2em;
                cursor: pointer;}
                .btn-primary{
                background-color: #000;
                border: none;
                transition: all 0.4s cubic-bezier(1, 0.2, 0.54, 0);
            }
            .btn:hover{
                background-color: #1b1b1b;
            }
            .mgT2{
                margin-top: 2rem;
            }
        </style>
    </head>
    <body>

        <div class="mail-body">
                <h2 class="h4">${data.message.header}</h2>
            <div class="mgT2">

            </div>

                <p class="mgT2 p">${data.message.body}</p>
                <h3 class="h6">Please Verify Your Email  </h3>
                <a href="${data.message.verificationLink}" class="btn btn-primary mgT2">Click here to verify</a>
                <p class="p mgT4">
                </p>

        </div>

    </body>
</html>
`);
}   
    
    sendEmail  = async function(){
        let  transporter =  nodeMailer.createTransport({
            pool: true,
            host: process.env.SMTP_HOSTNAME,
            port: process.env.MAIL_PORT,
            secure: true, // use TLS
            auth: {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
              }
          })

        await transporter.sendMail(this.emailOptions,(error,data)=>{
            if (error){
                return next(error)
            }else{
               return data
            }

        });
    }

}

export default Emailing