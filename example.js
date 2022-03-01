const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const mongoose = require('mongoose')
const fs = require('fs')
const { GridFsStorage } = require('multer-gridfs-storage')

const Grid = require('gridfs-stream')

const mongouri = 'mongodb://127.0.0.1:27017/task'

const conn = mongoose.createConnection(mongouri, { useNewUrlParser: true, useUnifiedTopology: true })

//gridfs variable
let gfs

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('users')
})

//create file storage
const storage = new GridFsStorage({
    url: mongouri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = file.originalname;
                const fileinfo = {
                    filename: filename,
                    bucketName: 'users',
                }
                resolve(fileinfo)
            })
        })
    }
})

const upload = multer({
    storage
});

//register
router.post('/register', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        res.send(user);
    }
});

//login
router.post('/login', (req, res) => {
    //email and password
    const email = req.body.email
    const password = req.body.password


    User.findOne({ email })
        .then(user => {

            if (!user) return res.status(400).json({ msg: "User not exist" })


            bcrypt.compare(password, user.password, (err, data) => {

                if (err) throw err

                if (data) {
                    return res.status(200).json({ msg: "Login success" })
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }

            })

        })

})
//get the userslist
router.get('/usersList', function (req, res) {
    User.find({}, function (err, users) {
        res.send(users);
    });
});

//update the document
router.post("/upload", upload.single("file"), async (req, res) => {
    // console.log(req.file)
    const fileId = req.file.id;
   // console.log('filesaved', fileId)
    const email = req.body.email;
    User.updateOne({ email }, {
        $set: {
            fileid: fileId,
        }
    }, { new: false }).then(user => {
        if (!user) return res.status(400).json({ msg: "email not exist" })

        else {
            res.status(200).send("uploaded file successfully")
        }
    })

})

//read the document
router.get("/read",(req,res)=>{
    const email=req.body.email
    const file=req.file
    User.find({email}).then((user)=>{
        console.log(user)
       const fileId=new mongoose.mongo.ObjectId(user[0].fileid)
       // const fileId=user[0].fileid
        console.log(fileId)
        gfs.files.findOne({_id:fileId}).then((file)=>{
           
          if(!file || file.length === 0) {
              return res.status(404).json({
             err: 'No file exist'
              })
          }
            else{
       console.log(fileId)
            const stream = Grid.createReadStream({_id:fileId})
            stream.pipe(res);
            }}).catch(error=>{
                console.log('error')
            })
  })
})
// router.get("/read", (req, res) => {
    
//     try {
//         const email=req.body.email
//         User.findOne({ email}).then(user);
//         //console.log(email)
//         const fileId=new mongoose.mongo.ObjectId(user[0].fileid)
//         var readStream = gfs.createReadStream({_id:fileId});
//         readStream.pipe(res); 
//     } catch (error) {
//         console.log(error);
//         res.send(error);
//     }
// })


module.exports = router;