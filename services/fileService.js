const express = require("express");
const mongoose = require("mongoose");
const fileDao = require("../Dao/fileDao");
const cron = require("node-cron");
const _ = require("lodash");
const {
  AuthCallsIpAccessControlListMappingPage,
} = require("twilio/lib/rest/api/v2010/account/sip/domain/authTypes/authCallsMapping/authCallsIpAccessControlListMapping");
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
const getUser = async (req, res) => {
  cron.schedule("0 * * * *", async () =>
    //for hour 0 * * * *
    {
      console.log(await fileDao.countDocuments());
    }
  );
  res.json(res.paginatedResults);
};
//show all files in db
const allfiles = async (req, res, next) => {
  await fileDao
    .showallfiles()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.send("error in listing  the document");
    });
};
//read operation
const read = async (req, res) => {
  try {
    // console.log("1")
    await fileDao
      .findoneuser(req, res)
      .then((user) => {
        //console.log(user)
        //console.log(user[0].file)
        // console.log(user[0].createdAt.toString())
        if (_.isEmpty(user[0].file)) {
          res.send("This user does not updated the document");
        } else {
          //const fileid= new mongoose.mongo.ObjectId(user[0].file[1]);
          //const fileid=user[0].file[0].fileid
          const fileId = user[0].file;
          // console.log(fileid)
          let lastValue = fileId[Object.keys(fileId).pop()];
          console.log(lastValue);
          console.log(lastValue.fileid);
          const fileid = lastValue.fileid;
          //console.log(fileid)
          fileDao.readfile(req, res, fileid);
        }
      })
      .catch((error) => {
        res.send("error");
      });
  } catch (e) {
    res.send("Error in fetching username in database");
  }
};
//delete the user
const deleteuser = async (req, res) => {
  try {
    fileDao
      .deleteuser(req, res)
      .then((user) => {
        if (user == null) {
          res.send("No User found");
        } else {
          const fileId = user.file;
          fileDao.gfsfiledelete(req, res, fileId);
          res.send("user deleted!!");
        }
      })
      .catch((e) => {
        res.send("Error deleting the file");
      });
  } catch (e) {
    res.send("Error in fetching a username to Delete");
  }
};
//Delete The specific document using username
const deletefile = async (req, res) => {
  const find = await fileDao.finduser(req, res);
  console.log(find);
  if (find === null) return res.send("Username does not existt");

  const fileId = find.file;
  const deletefileresult = await fileDao.deletefile(req, res, fileId);
  if (_.isEmpty(find.file)) {
    return res.send("User does not updated a file");
  } else {
    fileDao.gfsfiledelete(req, res, fileId);
    return res.send("Files Deleted!");
  }
};
//update the document
const update = async (req, res) => {
  try {
    const finduser = await fileDao.finduser(req, res);
    // console.log(finduser)
    if (_.isEmpty(finduser)) return res.send("Username does not exist");
    const file = finduser.file;
    await fileDao.updateFile(req, res, file);

    /*if(!_.isEmpty(finduser.file)){
           const fileID=finduser.file
           const ver=fileID[Object.keys(fileID).pop()]
          const version=ver.version
          await  fileDao.modifyuser(req,res,version,fileID)
        }
       else{
fileDao.updateuser(req,res)
          }*/
  } catch (e) {
    res.send("Error in fetching a username to Update");
  }
};
const userLocation = async (req, res) => {
  const result = await fileDao.locate(req, res);
  res.send(result);
};
const userDetails = async (req, res) => {
  const result = await fileDao.userDetailsDao(req, res);
  console.log(result);
  res.send(result);
};
module.exports = {
  update,
  getUser,
  read,
  deleteuser,
  deletefile,
  allfiles,
  userLocation,
  userDetails,
};
