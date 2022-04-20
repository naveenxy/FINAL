const express = require("express");
const router = express.Router();
const fileService = require("../services/fileService");
const { upload } = require("../middlewares/upload");
const token = require("../middlewares/token");
const paginatedResults = require("../middlewares/pagination");
const User = require("../models/user");

router.get(
  "/getUser",
  token.accessTokenVerify,
  paginatedResults(User),
  fileService.getUser
);
router.patch(
  "/update",
  token.accessTokenVerify,
  upload.array("file", 12),
  fileService.update
);
router.get("/read", token.accessTokenVerify, fileService.read);
router.delete("/delete", token.accessTokenVerify, fileService.deleteuser);
router.delete("/deletefile", token.accessTokenVerify, fileService.deletefile);
router.get("/showallfiles", token.accessTokenVerify, fileService.allfiles);
router.get("/userlocation", fileService.userLocation);
router.get("/userdetails", fileService.userDetails);

module.exports = router;
