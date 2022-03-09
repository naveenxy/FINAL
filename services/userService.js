const express=require('express')
const {hashValidator}=require('../middlewares/hashing')
const userDao=require('../Dao/userDao')
const { accessTokenGenerator, tokenValidator } = require('../middlewares/token')
const { refreshTokenGenerator } = require('../middlewares/token')
const { refreshTokenValidator} = require('../middlewares/token')
let { refreshTokens} = require('../middlewares/token')
const smsOtp=require('../middlewares/smsOtp')
const otp=require('../middlewares/smsOtpVerify')
const cronJob=require('../middlewares/cronJob')
const {decrypttext}=require('../middlewares/crypto')
const { response } = require('express')
var user,EmailId,PhoneNumber,username
// Register a user 
const register=async(req,res,next)=>
{
    try{
        const existingUsername=await userDao.finduser(req,res)
        if(existingUsername)
        {
             res.send('UserName already taken,choose another UserName')
        }
        else{
        await userDao.createUser(req,res)
        user=res.user
        EmailId=user.EmailId
        username=user.username
        PhoneNumber=user.PhoneNumber
       
        if(PhoneNumber)
        {
        await smsOtp(req,res,PhoneNumber,EmailId)
        res.send("enter otp")
        const otp =res.otp
       await userDao.saveOtp(req,res,otp,username)
       await cronJob.expiredOtp(username)
         }
         else {
             res.send("Enter your Phone Number for verfication")
         }
        }
}
catch(e)
 {
    console.log('Error in userservice')
 }}

const otpVerify=async(req,res)=>{
await otp(req,res,PhoneNumber,EmailId,username)
} 
//Login a user
const login=async(req,res)=>
{
    try{
        const existingUser=await userDao.finduser(req,res)
         if(!existingUser)
          {
        res.send("Username does not exist,Please create one")
         }
          else{
        const checkUser=await hashValidator(req.body.password,existingUser.password)
        if(!checkUser)
        {
            res.send("The Password you've entered is  invalid,Please enter your correct password")
        }
        else
        {
            const access_token= accessTokenGenerator(existingUser.username)
            const refresh_token= refreshTokenGenerator(existingUser.username)
            refreshTokens.push(refresh_token)
            res.json({
               message:'User login successful',
               access_token:access_token,
               refresh_token:refresh_token
           })
               
        }
    }
}
    catch(e){
        res.status(400).send('error logging ')
            }
    }
const refreshToken =async(req,res)=>{
    const refreshToken=req.body.refresh_token
    if(refreshToken == null ||!refreshTokens.includes(refreshToken)) return res.send('No refreshToken')
   else{
       const token= refreshTokenValidator(refreshToken)
       const access_token=accessTokenGenerator(token.username)
        res.json({ access_token:access_token,
                    refresh_token:refreshToken 
                 })
  }
}
const getUserwithEmail=async(req,res)=>{
   
    const result=await  userDao.finduserwithEmailID(req,res).then((response) => {
        return response
     }) 
    .catch(error=> {
        res.send("error in listing  the document")
        })
      res.send(result)

}

const aggregateUserAndFile=async(req,res)=>{
const ss=await userDao.aggregateUserAndFiles()
console.log(ss)
res.send(ss)
   
   
    
    
    

}









const logout=async(req,res)=>{
    refreshTokens =await refreshTokens.filter(refresh_token=> refresh_token!==req.body.refresh_token)
    res.send("logout success")
}
module.exports={register,login,refreshToken,logout,otpVerify,getUserwithEmail,aggregateUserAndFile}
