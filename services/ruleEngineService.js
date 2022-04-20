const express = require("express");
const ruleEngine = require("../models/ruleEngine");

const createruleEngine = async (req, res) => {
  console.log("!");
  const rule = new ruleEngine({
    name: req.body.name,
    agegreaterThan: req.body.agegreaterThan,
  });

  await rule.save(function (err, result) {
    if (err) {
      console.log("error in db");
    } else {
      console.log(result);
    }
    res.send("done");
  });
};
module.exports = { createruleEngine };
