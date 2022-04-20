const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ruleEngine = new Schema({
  name: {
    type: String,
  },
  staticFacts: {
    type: Schema.Types.Mixed,
  },
});
module.exports = mongoose.model("ruleEngine", ruleEngine);
