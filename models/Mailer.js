require('dotenv').config();
const nodemailer = require('nodemailer');

class Mailer {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    
    /**
     * @param {String} from 
     * @param {String} to 
     * @param {String} subject 
     * @param {String} text 
     */
    sendEmail = async (from, to, subject, text) => {
        try {
            await this.transporter.sendMail({ from: from, to: to, subject: subject, text: text });
        } catch (err) {
            return err;
        }
    }

    /**
     * @param {String} to 
     * @param {String} url 
     */
    sendConfirmationEmail = async (to, url) => {
        try {
            await this.transporter.sendMail({ 
                from: process.env.EMAIL_FROM, 
                to: to, 
                subject: 'Confirmer votre email', 
                html: `Cliquer sur le lien pour finaliser la création de votre compte : <a href="${url}">Confirmer</a>` 
            });
        } catch (err) {
            return err;
        }
    }
}

module.exports = Mailer;
