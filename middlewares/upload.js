const path=require('path')
const multer=require('multer')
const crypto = require('crypto')
const mongoose = require('mongoose')
const fs  = require('fs')
const {GridFsStorage}= require('multer-gridfs-storage')
const Grid = require('gridfs-stream')

const mongouri = 'mongodb://127.0.0.1:27017/task'

const conn = mongoose.createConnection(mongouri,{ useNewUrlParser: true,useUnifiedTopology: true } )

//gridfs variable
let gfs

conn.once('open', ()=> {
gfs = Grid(conn.db,mongoose.mongo)
gfs.collection('users')
})

//create file storage
const storage = new GridFsStorage({
url:mongouri,
file:(req,file) =>{
   return new Promise((resolve,reject) =>{
   crypto.randomBytes(16, (err, buf)=>{
  if(err) {
      return reject(err)
  }
  const filename = file.originalname
  const fileinfo = {
      filename:filename,
      bucketName:'users'
       }
       resolve(fileinfo)
     })
   })
  }
})
const upload = multer({ storage} )

module.exports.upload=upload

