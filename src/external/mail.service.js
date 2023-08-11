import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'cnsender2@gmail.com',
        pass: 'qrqulwdosrfoimld',
      }
});

export async function sendOTPviaEmail(email, otp) {
    try {
    const mailOptions = {
        from: 'cnsender2@gmail.com', 
        to: email, 
        subject: 'OTP for Password reset', 
        text: `Your OTP for password reset is: ${otp}`, 
        
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    }
    catch (err) {
        console.log(
          'Email send failed with error: ' + err
        );
      }
}
