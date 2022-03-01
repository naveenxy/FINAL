const express=require('express')
const mongoose = require('mongoose')
const User=require('../models/user')
const {hashGenerate}=require('../middlewares/hashing')
const path=require('path')

const mongourl = 'mongodb://127.0.0.1:27017/task'
const Grid = require('gridfs-stream')
const {decrypttext}=require('../middlewares/crypto')
const conn = mongoose.createConnection(mongourl,{ useNewUrlParser: true,useUnifiedTopology: true } )
let gfs
conn.once('open', ()=> {
 gfs = Grid(conn.db,mongoose.mongo)
gfs.collection('users')
})
var timezone=Intl.DateTimeFormat().resolvedOptions().timeZone


const createUser=async(req,res)=>{
    const hashedPassword= await hashGenerate(req.body.password)
    
        const user =new User({
       FirstName:req.body.FirstName, 
       LastName:req.body.LastName,
       username:req.body.username,
       EmailId: req.body.EmailId,
       PhoneNumber:req.body.PhoneNumber,
       password:hashedPassword
         })
        res.user=user
        
      //  console.log(user.EmailId)
         await user.save(function(err,result){
            if (err){
                console.log('error in db')
            }
         
        } )
         
     
 }

 
const finduser=async(req,res)=>{return await User.findOne({username:req.body.username})}
const saveOtp=async(req,res,otp,username)=>{
    console.log(username)
   return await  User.updateOne({username:username},
    
        {
            $set:{OTP:otp,
                OtpStatus:'Pending',
                Location:timezone
            }
        
        },{multi:true}, function(err, user){ 
            console.log(' OTP saved to Database') 
          })
}
const findEmail=async(req,res,username)=>{return await User.findOne({username:username})}
const deleteOtp=async(req,res,EmailId)=>{
    return  await  User.updateOne( {EmailId:EmailId},
    { $unset: { OTP: "" }}
 )
 }
 const deleteuser=async (req,res,EmailId)=>{  return await User.findOneAndDelete({EmailId:EmailId})}
const VerifiedUser=async(req,res,username)=>{
    return await  User.updateOne({username:username},
         {
             $set:{
                 OtpStatus:'Verified'
             }
         
         },{multi:true}, function(err, user){ 
             console.log(' OTP Verified') 
           })
 }
 const expiredOtpUser=async(req,res,username)=>{
     
    return await  User.updateOne({username:username,OtpStatus:'Pending'},
         {
             $set:{ OtpStatus:'Expired'}
         
         })
 }
 const ExpiredUser=async (req,res)=>{  
    return await User.deleteMany({OtpStatus:'Expired'})}


const finduserwithEmailID=async(req,res)=>{
        const EmailId=req.body.EmailId
       return await  User.findOne({EmailId:EmailId})
    }
const aggregateUserAndFiles=async(req,res)=>{
  
 const result=await gfs.files.aggregate([
    

  { $lookup:
             {
               from: "users",
               localField: '_id',
               foreignField: "file",
               as: "result"
             }
           },
           {$sort:{"result.username":1}},
          { $group : { _id :{filetype: "$contentType"}, username: { $push: "$result.username" } } },
          
          

        ])
 const s=await  result.toArray()

return s
 //console.log(result)      
//res.send(result)
    

}








module.exports={finduserwithEmailID,finduser,createUser,saveOtp,finduser,findEmail,deleteOtp,deleteuser,VerifiedUser,expiredOtpUser,ExpiredUser,aggregateUserAndFiles}
/*const result=  await  User.aggregate([
     
    { $sort : { filename:1 } }
  
   /*   { $lookup:
             {
               from: "users.files",
               localField: 'file',
               foreignField: "_id",
               as: "result"
             }
           },
           
       /*    { $group:({ 
             _id: "$result.contentType" ,
            
           })}*/
           //{ $sort : { username:1 } },
          /* {$project:{
                  "result._id":0,
                  "result.length":0,
                  "result.chunkSize": 0,
                  "result.uploadDate": 0,
                  "result.filename":0,
            }}
       ])
       return result*/