const express = require("express");
const { hashValidator } = require("../middlewares/hashing");
const userDao = require("../Dao/userDao");
const {
  accessTokenGenerator,
  tokenValidator,
} = require("../middlewares/token");
const { refreshTokenGenerator } = require("../middlewares/token");
const { refreshTokenValidator } = require("../middlewares/token");
let { refreshTokens } = require("../middlewares/token");
const sendotp = require("../middlewares/smsOtp");
//const {otptoemailonly}=require('../middlewares/smsOtp')
const otp = require("../middlewares/smsOtpVerify");
const cronJob = require("../middlewares/cronJob");
const { decrypttext } = require("../middlewares/crypto");
const { response } = require("express");
const rules = require("../middlewares/ruleEngine");
const _ = require("lodash");
const fileDao = require("../Dao/fileDao");
const ruleEngine = require("../models/ruleEngine");
const IPrules = require("../models/ipModel");
const User = require("../models/user");
const rulesDao = require("../Dao/ruleDao");
const { Engine } = require("json-rules-engine");
var user, EmailId, PhoneNumber, username, age;
// Register a user

const engine = new Engine();
const register = async (req, res, next) => {
  try {
    const existingUsername = await userDao.finduser(req, res);
    if (existingUsername) {
      res.send("UserName already taken,choose another UserName");
    } else {
      await userDao.createUser(req, res);
      user = res.user;
      EmailId = user.EmailId;
      username = user.username;
      PhoneNumber = user.PhoneNumber;
      age = user.age;
      const rule = await rules(age);
      if (PhoneNumber === "Missing" && !rule) {
        await fileDao.deleteuser(req, res, username);
        return res.send("Enter your mobile Number");
      } else if (PhoneNumber === "Missing" && rule) {
        await sendotp.otptoEmail(req, res, EmailId);
      } else {
        await sendotp.otptoSms(req, res, PhoneNumber);
        await sendotp.otptoEmail(req, res, EmailId);
      }
      const otp = res.otp;
      await userDao.saveOtp(req, res, otp, username);
      await cronJob.expiredOtp(username);
      return res.send("enter otp");
    }
  } catch (e) {
    console.log(e);
    console.log("Error in userservice");
  }
};

const otpVerify = async (req, res) => {
  await otp(req, res, PhoneNumber, EmailId, username);
};

//Login a user
const login = async (req, res) => {
  try {
    const existingUser = await userDao.finduser(req, res);
    if (!existingUser) {
      res.send("Username does not exist,Please create one");
    } else {
      const checkUser = await hashValidator(
        req.body.password,
        existingUser.password
      );
      if (!checkUser) {
        res.send(
          "The Password you've entered is  invalid,Please enter your correct password"
        );
      } else {
        const access_token = accessTokenGenerator(existingUser.username);
        const refresh_token = refreshTokenGenerator(existingUser.username);
        refreshTokens.push(refresh_token);
        res.json({
          message: "User login successful",
          access_token: access_token,
          refresh_token: refresh_token,
        });
      }
    }
  } catch (e) {
    res.status(400).send("error logging ");
  }
};
const refreshToken = async (req, res) => {
  const refreshToken = req.body.refresh_token;
  if (refreshToken == null || !refreshTokens.includes(refreshToken))
    return res.send("No refreshToken");
  else {
    const token = refreshTokenValidator(refreshToken);
    const access_token = accessTokenGenerator(token.username);
    res.json({ access_token: access_token, refresh_token: refreshToken });
  }
};
const getUserwithEmail = async (req, res) => {
  const result = await userDao
    .finduserwithEmailID(req, res)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      res.send("error in listing  the document");
    });
  res.send(result);
};

const aggregateUserAndFile = async (req, res) => {
  const ss = await userDao.aggregateUserAndFiles();
  console.log(ss);
  res.send(ss);
};

const logout = async (req, res) => {
  refreshTokens = await refreshTokens.filter(
    (refresh_token) => refresh_token !== req.body.refresh_token
  );
  res.send("logout success");
};
module.exports = {
  register,
  login,
  refreshToken,
  logout,
  otpVerify,
  getUserwithEmail,
  aggregateUserAndFile,
};
