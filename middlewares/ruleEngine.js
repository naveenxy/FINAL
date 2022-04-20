const { Engine } = require("json-rules-engine");
const _ = require("lodash");
const ruleEngine = require("../models/ruleEngine");
const rulesDao = require("../Dao/ruleDao");
const engine = new Engine();
async function rules(age) {
  const ruleA = await rulesDao.rulesresult("age");
  engine.addRule(ruleA);
  const { events } = await engine.run({ age: age });
  return _.isEmpty(events);
}

module.exports = rules;
