const nodemailer = require("nodemailer");
import logger from "../../settings/logger";
const transporter = nodemailer.createTransport({
  service: 'mail.ru',
  auth: {
    user: process.env.email_pseudo ,
    pass: process.env.email_password
  }
});

export default class Mailer {
	
	static forgotPassMail(to: string, token: string){
		const text: string = "Click on the link to reset your password \n note that if you are on oauth all future connection will need to be via email\n http://109.24.205.20/resetPassword?token=" + token + "&email="+ to +" \nthis mail  is only valide a few minute hurry up 😱";
		var mailOptions = {
		  from: process.env.email_pseudo ,
		  to: to,
		  subject: "Reset password 🦃🦃🦃",
		  text: text
		};
		transporter.sendMail(mailOptions, function(error: string, info:any){
			if (error) {
				logger.info(error);
			} else {
				logger.info('Email sent: ' + info.response);
			}
		  }); 
	}
	
}
