const express=require('express')
const mongoose = require('mongoose')
const fileDao=require('../Dao/fileDao')
const cron =require('node-cron')
//process.env.TZ = 'Canada/Newfoundland'
/*var d = new Date()
d.setDate(24)
console.log(d)
console.log(d.toLocaleTimeString())
console.log( d.toDateString())
console.log( d.getDate())
console.log( d.getTime())*/
// Get User
//console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
const getUser =async(req,res)=>{
   cron.schedule("0 * * * *",async()=>    //for hour 0 * * * * 
     {
        console.log(await fileDao.countDocuments())
    })
  res.json(res.paginatedResults)
   
}
//show all files in db
const allfiles=async(req,res,next)=>{
    await fileDao.showallfiles().then((user) => {

       
        res.send(user)
     }) 
    .catch(error=> {
        res.send("error in listing  the document")
        })
}
//read operation
const read =async(req,res)=>{
    try{ 
        console.log("1")
    await fileDao.findoneuser(req,res).then((user)=>
    
  { 
      console.log(user)
      console.log(user[0].createdAt.toString())
      if(user[0].file=== undefined)
           {
               res.send("This user does not updated the document")
            }
          else{
           
         const fileid= new mongoose.mongo.ObjectId(user[0].file);
         
             fileDao.readuser(req,res,fileid).then((file) =>{ 
                if(!file || file.length === 0) {
                    return res.status(404).json({
                   err: 'No file exist'
                    })
                }
                  else{
                       fileDao.readfile(req,res,fileid)
                  }}).catch((e)=>{
                     return res.send("error")
                  })}
}).catch((error)=>{
     res.send('username not found')
  })
}
catch(e){
    res.send('Error in fetching username in database')
}}
//delete the user
const deleteuser=async(req,res)=>
{ 
    try{
  fileDao.deleteuser(req,res).then((user)=>{
     if(user== null){
          res.send('No User found')
        }
        else{
            const fileId=user.file
           fileDao.gfsfiledelete(req,res,fileId)
           res.send("user deleted!!")
        }
    }).catch((e)=>{
        res.send('Error deleting the file')
        })
    }
catch(e){
    res.send('Error in fetching a username to Delete')
}}
//Delete The specific document using username
const deletefile =async (req,res)=>{
 const find=   await fileDao.finduser(req,res)
 console.log(find)
if(find===null)
return res.send("Username does not existt")

 const fileId=find.file
   const deletefileresult= await fileDao.deletefile(req,res,fileId)
   const user= deletefileresult.result
   console.log(user)
   
        if(user.n===0 &&user.ok===1){
             return res.send("User does not updated a file")
         }
         else if(user.n===1 &&user.ok===1)
         {
             return res.send("File Deleted!")
         }
     
    }
//update the document
const update=async (req, res) =>{
try{
   await fileDao.finduser(req,res).then((response) => {
       console.log(response)
       if(response==null) return res.send("Username does not existt")
       if(response.file){
           const fileId=response.file
          fileDao.gfsfiledelete(req,res,fileId)
           fileDao.modifyuser(req,res)
        }
       else{
          fileDao.updateuser(req,res)
          }
   })
     .catch((e)=> {
         res.send('error')
         })
     }
 catch(e)
 {
     res.send('Error in fetching a username to Update').status(400)
 }
 }
 const userLocation=async(req,res)=>{
      const result=await fileDao.locate(req,res)
      res.send(result)
      
 }
module.exports={update,getUser,read,deleteuser,deletefile,allfiles,userLocation}




