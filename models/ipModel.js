const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const IPrules = new Schema({
  Address: {
    type: String,
  },
  Start_Address: {
    type: String,
  },
  End_Address: {
    type: String,
  },
  Star_Address: {
    type: String,
  },
});

module.exports = mongoose.model("IPrules", IPrules);
