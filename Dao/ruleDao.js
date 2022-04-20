const express = require("express");
const ruleEngine = require("../models/ruleEngine");
const mongoose = require("mongoose");
const _ = require("lodash");
const rulesresult = async (name) => {
  const result = await ruleEngine.findOne({ name: name });
  return result.staticFacts;
};
module.exports = { rulesresult };
