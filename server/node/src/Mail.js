let nodemailer = require('nodemailer');

const develop = process.env.DEVELOP === "true";
const debug = process.env.DEBUG === "true";
const mailer_addr = process.env.NODE_MAILER_ADDR || "sailracetesting@gmail.com";
const mailer_pass = process.env.NODE_MAILER_PASS || "chhqspixujwdywqu";


// Create a mail transporter
let transporter = develop ? null : nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailer_addr,
        pass: mailer_pass
    }
});


/**
 * Sends a mail containing the password to the defined email
 * @param {String} email 
 * @param {String} password 
 * @returns true if sending was successful, throws error otherwise
 */
async function sendEmailToUser(email, password) {
    if (!develop) {
        const mailOptions = {
            from: mailer_addr,
            to: email,
            subject: 'Your SailRace password',
            text: 'Hello Sailor!\n\nYour SailRace password is: ' + password + '\n\nBr:\nSailRace Team'
        };

        await transporter.sendMail(mailOptions)
            .then((x) => { if (debug) console.log("Sending mail is successful: " + x); })
            .catch(err => { throw new Error("Error when sending mail: " + err.message); });
    }

    return true;
}


module.exports = {
    sendEmailToUser
};

//https://www.youtube.com/watch?v=2noQO99PNEI
//https://www.w3schools.com/nodejs/nodejs_email.asp
// In https://myaccount.google.com/security, do you see 2-step verification set to ON? If yes, then visiting https://myaccount.google.com/apppasswords should allow you to set up application specific passwords. 
