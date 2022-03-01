const emailAndSms=require('./emailAndSms')
const userDao=require('../Dao/userDao')
const emitter = require('../middlewares/emailAndSms')
const printEmitter = emitter.myEmitter
const {decrypttext}=require('../middlewares/crypto')
const otpVerify=async(req,res,PhoneNumber,EmailId,username)=>{
   const otpcode=req.body.otp
   try{
      await userDao.findEmail(req,res,username).then(async(response) => {
          if(response.OTP){
             if(response.OTP=== otpcode &&response.OtpStatus ==='Pending'){
              userDao.VerifiedUser(req,res,username)
              
              printEmitter.emit('send',PhoneNumber,EmailId)
              res.send("OTP Verified and User Registration Successful!!")
             }
             else if (response.OTP!== otpcode &&response.OtpStatus ==='Pending'){
                res.send("Invalid OTP")
             }
             else if (response.OtpStatus ==='Expired'){
               res.send('OTP expired')
            }
              }   
        }).catch((e)=> {
           res.send('OTP expired')
            })
         }
         catch{
            console.log('Error Ocurred')
 }
        }
module.exports=otpVerify