const express = require("express");
const {
  SchemaVersionPage,
} = require("twilio/lib/rest/events/v1/schema/version");
const IpDao = require("../Dao/iPDao");

const saveIP = async (req, res) => {
  await IpDao.SaveIPaddr(req, res);
};
function checkIs(entry) {
  var blocks = entry.split(".");
  if (blocks.length === 4) {
    return blocks.every(function (block) {
      return (
        (parseInt(block, 10) >= 0 && parseInt(block, 10) <= 255) || block == "*"
      );
    });
  }
  return false;
}
function startonumber(entry) {
  var blocks = entry.split(",");
  const arr = [];
  arr.start = blocks.map((e) => e.replace("*", "0"));
  arr.end = blocks.map((e) => e.replace("*", "255"));
  return arr;
}
function IPtoNumcomma(ip) {
  return ip
    .split(",")
    .map((d) => ("000" + d).substr(-3))
    .join("");
}
function IPtoNum(ip) {
  return ip
    .split(".")
    .map((d) => ("000" + d).substr(-3))
    .join("");
}
function ip(ip) {
  return ip.split(".");
}
const checkIP = async (req, res) => {
  var resultip;
  var checkip = req.body.checkip;
  if (!checkIs(checkip)) {
    return res.send("Invalid IPP");
  }
  checkip = IPtoNum(checkip);
  const result = await IpDao.checkIPaddr(req, res).then((ipAddress) => {
    ipAddress.some((meme) => {
      if (meme.Address) {
        var start = ip(meme.Address);
        var end = ip(meme.Address);
        start = startonumber(start.toString());
        end = startonumber(end.toString());
        start = IPtoNumcomma(start.start.toString());
        end = IPtoNumcomma(end.end.toString());
        if (start <= checkip && end >= checkip) {
          return (resultip = "Valid");
        } else {
          resultip = "Invalid";
        }
      } else if (meme.Start_Address && meme.End_Address) {
        var startip = IPtoNum(meme.Start_Address);
        var endip = IPtoNum(meme.End_Address);
        if (startip <= checkip && endip >= checkip) {
          return (resultip = "Valid");
        } else {
          resultip = "Invalid";
        }
      }
    });
  });
  if (resultip === "Valid") {
    res.send("Valid Ip");
  } else {
    res.send("Invalid IP");
  }
};
module.exports = { saveIP, checkIP };
