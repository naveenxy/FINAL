const cron =require('node-cron')
const  userDao=require('../Dao/userDao')

const otp =async ()=>{
     cron.schedule('* * * * * *',(req,res)=>{
    userDao.ExpiredUser(req,res)
})
}
const expiredOtp=async(username)=>{ 
const date =new Date()
const minutes=date.getMinutes()
const seconds=date.getSeconds()
   cron.schedule(`${seconds} ${minutes+3} * * * *`,async(req,res)=>{
    await userDao.expiredOtpUser(req,res,username)
})
}
module.exports={otp,expiredOtp}