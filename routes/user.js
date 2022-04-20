const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const ruleService = require("../services/ruleEngineService");
const token = require("../middlewares/token");
router.post("/register", userService.register);
router.post("/login", userService.login);
router.post("/OtpVerify", userService.otpVerify);
router.post("/email", userService.getUserwithEmail);
router.post(
  "/refreshtoken",
  token.refreshTokenVerify,
  userService.refreshToken
);
router.post("/aggregate", userService.aggregateUserAndFile);
router.delete("/logout", userService.logout);
router.post("/rules", ruleService.createruleEngine);
module.exports = router;
