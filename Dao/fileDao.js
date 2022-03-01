const express=require('express')
const User=require('../models/user')
const mongoose = require('mongoose')
const mongourl = 'mongodb://127.0.0.1:27017/task'
const Grid = require('gridfs-stream')
const {decrypttext}=require('../middlewares/crypto')
const conn = mongoose.createConnection(mongourl,{ useNewUrlParser: true,useUnifiedTopology: true } )
let gfs
conn.once('open', ()=> {
 gfs = Grid(conn.db,mongoose.mongo)
gfs.collection('users')
})
/*var timezone=Intl.DateTimeFormat().resolvedOptions().timeZone
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone
)
console.log( new Date().getTimezoneOffset())
console.log( -(new Date().getTimezoneOffset() / 60))
function pad(number, length){
  var str = "" + number
  while (str.length < length) {
      str = '0'+str
  }
  console.log(str)
  return str
  var offset = new Date().getTimezoneOffset()
offset = ((offset<0? '+':'-')+ // Note the reversed sign!
        pad(parseInt(Math.abs(offset/60)), 2)+
        pad(Math.abs(offset%60), 2))
}
function getTimeZone() {
  var offset = new Date().getTimezoneOffset(), o = Math.abs(offset)
  console.log(offset)
console.log(o)
  return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2)
}

console.log(getTimeZone())
*/
var countDocuments=async()=>{ return await User.countDocuments().exec()}

const getUser=async(limit,startIndex)=>{
  

 return await  User.find({}).limit(limit).skip(startIndex).exec()
}
 const decrypuser=async(limit,startIndex)=>{
   try{
 var getuser= await  getUser(limit,startIndex)


const myuser=async()=>{
    getuser.forEach (async user=>{
     
      user.EmailId=  decrypttext(user.EmailId)
      user.PhoneNumber=    decrypttext(user.PhoneNumber)
 })
    return getuser
  }
  return myuser()

   }
   catch(e){
     console.log('error')
   }
}

const showallfiles=()=>{ return User.find({}).select('-_id username ')}
const deleteuser=async (req,res)=>{  return await User.findOneAndDelete({username:req.body.username})}
const deletefile=async (req,res,fileId)=>{
    await User.updateOne( {username:req.body.username},
    { $unset: { file: "" }}
  )
  return gfs.files.deleteOne({ _id: fileId });
  
}
 const readfile=async(req,res,fileid)=>{
   const readstream= gfs.createReadStream({_id:fileid});

  readstream.pipe(res);

 }
 const finduser=async(req,res)=>{return await User.findOne({username:req.body.username})}
 const gfsfiledelete=(req,res,fileId)=>{
     gfs.files.deleteOne({ _id: fileId })
 }
 const modifyuser=async(req,res)=>{
    const username=req.body.username
    const file=req.file
    const fileId=file.id
   return await  User.updateOne({username:username},
        {
            $set:{file:fileId}
        
        },{multi:true}, function(err, user){ 
          res.send(' Modification completed successfully ') 
        })}
const updateuser=async(req,res)=>{
    const username=req.body.username
    const file=req.file
    const fileId=file.id
  return await  User.updateOne({username:username},
        {
            $set:{file:fileId}
        
        },{multi:true}, function(err, user){ 
          res.send(' Update completed successfully ') 
        })}    
const findoneuser=async(req,res)=>{ return await User.find({username:req.body.username})} 
const readuser =async(req,res,fileid)=>{return await   gfs.files.findOne({_id:fileid})}  



const locate=async(req,res)=>{
  const date=req.body.date
  const starttime=req.body.starttime
  const endtime=req.body.endtime
 return User.aggregate([
  { $addFields: {
   userDate: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt",timezone:"$Location"  }},
  userTime: { $dateToString: { format: "%H:%M", date: "$createdAt",timezone:"$Location" }}
 }},
    {
      $group:{_id:{"Location":"$Location","username":"$username"},Date:{$push:"$userDate"},Time:{$push:"$userTime"}}
   },
   {
      $match:
        {
           $and: [ {
           "Date":{ $eq: [ date] }},{"Time": { $gte: [ starttime ] } }, { "Time": { $lt: [ endtime ] } 
          }]
         }
      },
   { $addFields:
        {
     Time: {
        $function: {
          body:
          function(Time)  {
          var time=Time.toString()
          var hours = time.slice(0,2);
          var minutes = time.slice(3,5);
          var ampm = hours >= 12 ? 'pm' : 'am';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? '0'+minutes : minutes;
          var strTime = hours + ':' + minutes + ' ' + ampm;
          return strTime
        } ,
          args:  [ "$Time" ],
          lang: "js"
        }
      }
    }
  }
  ])
}
module.exports={countDocuments,getUser,showallfiles,readfile,deletefile,deleteuser,finduser,updateuser,modifyuser,findoneuser,readuser, decrypuser,gfsfiledelete,locate}