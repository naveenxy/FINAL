const express=require('express')
const User=require('../models/user')
const mongoose = require('mongoose')
const mongourl = 'mongodb://127.0.0.1:27017/task'
const Grid = require('gridfs-stream')
const {decrypttext}=require('../middlewares/crypto')
const _ =require('lodash')
const { response } = require('express')
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
  //return gfs.files.deleteOne({ _id: fileId });
  
}
 const readfile=async(req,res,fileid)=>{
 
  _.map(fileid,function(obj){
    const readstream= gfs.createReadStream(obj);
    readstream.pipe(res)
    // return readstream.pipe(res);
   })

  
 }
 const finduser=async(req,res)=>{return await User.findOne({username:req.body.username})}
 const gfsfiledelete=(req,res,fileId)=>{
     gfs.files.deleteOne({ _id: fileId })
 }
 const modifyuser=async(req,res,fileID)=>{
    const username=req.body.username
    var files=[]
    files.arr=req.files
    const y= _.map(files.arr,function(obj){
      var arr=[]
      return _.concat(arr, obj.id);
     
    })
     const x= _.flattenDeep(y);
    const fileId=_.concat(fileID,x)
  
    await  User.updateOne({username:username},
        {
            $set:{file:fileId}
        
        },{multi:true}, function(err, user){ 
          res.send(' Modification completed successfully ') 
        })}
const updateuser=async(req,res)=>{
    const username=req.body.username
    var files=[]
    files.arr=req.files
    const y= _.map(files.arr,function(obj){
      var arr=[]
      return _.concat(arr, obj.id);
     
    })
    const fileId= _.flattenDeep(y)
    
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
const userDetailsDao=async(req,res)=>{
  const user= await User.find({})
 // console.log(user)
return  User.aggregate([
  {
    $facet: {
    'Total number of users': [
     { $count: 'Total number of users' }
    ],
   
    'No of users with mobile number': [
      { $match: { PhoneNumber: { $ne: null } } },
        { $count: 'No of users with mobile number' }
    ],
    'Number of users with files': [
      { $match: { file: { $ne: null } }},
      { $count: 'Number of users with files' }
  ],
  'Number of users without files': [
    { $match: { file: { $eq: null } }},
    { $count: 'Number of users without files' }
],
'Total number of files': [
 { $match:{ file: { $ne: null }} },
 {$group: { _id: null, 'Total number of files': { $sum: { $size: "$file"}} }}

] }
},
{
  $project: {
  'Total number of users': {$ifNull:[{ $arrayElemAt: ['$Total number of users.Total number of users', 0]},0] },
  'No of users with mobile number': {$ifNull:[{ $arrayElemAt: ['$No of users with mobile number.No of users with mobile number', 0]},0] },
  'Number of users with files': {$ifNull:[{ $arrayElemAt: ['$Number of users with files.Number of users with files', 0]},0] },
  'Number of users without files':{$ifNull:[{ $arrayElemAt: ['$Number of users without files.Number of users without files', 0] },0]},
  'Total number of files': {$ifNull:[{ $arrayElemAt: ['$Total number of files.Total number of files', 0]},0] },
  
  
  }
}
])
  
}
module.exports={countDocuments,getUser,showallfiles,readfile,deletefile,deleteuser,finduser,updateuser,modifyuser,findoneuser,readuser, decrypuser,gfsfiledelete,locate,userDetailsDao}
// {file: { $elemMatch: { $ne: null } }}
/*
TotalLights": {
      "$ifNull": [{ "$arrayElemAt": ["$array.TotalLights", 0] }, 0 ]
    }
*/







/* {
      $count:"Total number of users"
    },
    {$addFields: {
      // "Total number of users":{$count:1},
       'PhoneNumber_exists': {'$or': [
           {'$eq': ['$PhoneNumber', null]},
           {'$gt': ['$PhoneNumber', null]},
       ]},
       'file_exists': {'$or': [
         {'$eq': ['$file', $ne=[]]},
         {'$gt': ['$file',  $ne=[]]},
     ]},
     "numberOffiles": { $cond: { if: { $isArray: "$file" }, then: { $size: "$file" }, else: 0} },
   },
   FinalResult:{
 
     $function:{
     body: 
     function(PhoneNumber_exists,file_exists,numberOffiles){
       return PhoneNumber_exists
     },
     args: ["$PhoneNumber_exists","$file_exists","$numberOffiles"],
     lang: "js"
   }
 }
 },{
   $project:{
     "_id":0,
     "PhoneNumber_exists":1,
     'file_exists':1,
     "numberOffiles":1,
     "FinalResult":1
  //   "total number of files":1
   //  "Total number of users":1
  //   "TotalNumberofFiles":1
 // quizTotal: { $sum: "$numberOffiles"}
     
 }
 } 
 */
 /*
 ,{
   {
    $addFields: {
      // "Total number of users":{$count:1},
       'PhoneNumber_exists': {'$or': [
           {'$eq': ['$PhoneNumber', null]},
           {'$gt': ['$PhoneNumber', null]},
       ]},
       'file_exists': {'$or': [
         {'$eq': ['$file', $ne=[]]},
         {'$gt': ['$file',  $ne=[]]},
     ]},
     "numberOffiles": { $cond: { if: { $isArray: "$file" }, then: { $size: "$file" }, else: 0} },
  }
  
 },
 {
   $addFields:{
    Totalfiles:{
      $function:
        {
           body: function(numberOffiles) {
              if(numberOffiles) return 1
              else return 0
              
            
           },
           args: [ '$PhoneNumber_exists'],
           lang: "js"
        }
      }

   }
 },{
  $project:{
    "_id":0,
    "username":1,
    "PhoneNumber_exists":1,
    'file_exists':1,
    "numberOffiles":1,
  "Totalfiles":1
   }
} 
 
 
 */