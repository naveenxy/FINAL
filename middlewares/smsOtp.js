const path = require('path')
const sgMail = require('@sendgrid/mail');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
})
sgMail.setApiKey(process.env.API_KEY);

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const  ServiceSid=process.env.MESSAGING_SERVICE_ID
const client = require('twilio')(accountSid,authToken);
function generateOTP() {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++ ) {
      OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
const smsOtp=async(req,res,decryptedNumber,decryptedEmail)=>{
   res.otp=generateOTP()
  await client.messages 
      .create({ 
         body: 'Your OTP is '+res.otp+' your otp will expires in 5 mins   -Team SnapChat', 
         //from: '+19377613900', 
         messagingServiceSid: ServiceSid,      
         to: decryptedNumber 
       }) 
      .then(message => console.log('OTP sent to Mobile Number')) 
      if(decryptedEmail)
      {
        const msg = {
          to: decryptedEmail,
          from: {
            name:'Team SnapChat',
            email:'navenaveenkumar.00@gmail.com'
          },
          subject: 'OTP Verification',
          text: 'Your OTP is '+res.otp+' your otp will expires in 5 mins   -Team SnapChat',
          html: '<strong>Your OTP is '+res.otp+' your otp will expires in 5 mins   -Team SnapChat</strong>'
         
        };
        sgMail.send(msg).then(()=>{
          console.log(' Email  OTP sent')
        
        }).catch((error)=>{
          console.log('Email Not delivered')
        })
      }

}
module.exports=smsOtp