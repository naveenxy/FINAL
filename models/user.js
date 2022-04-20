const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const { encrypt } = require("../middlewares/crypto");
const { decrypt } = require("../middlewares/crypto");

const User = new Schema(
  {
    FirstName: {
      type: String,
      required: true,
      trim: true,
    },
    LastName: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    EmailId: {
      type: String,
      required: true,
      trim: true,
      set: encrypt,
      get: decrypt,
    },
    PhoneNumber: {
      type: String,
      set: encrypt,
      get: decrypt,
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("strong is invalid");
        }
      },
    },
    file: [
      {
        fileid: {
          type: [Schema.Types.ObjectId],
        },
        _id: false,
        version: {
          type: Number,
          _id: false,
        },
      },
    ],
    OTP: {
      type: String,
    },
    OtpStatus: {
      type: String,
    },
    Location: {
      type: String,
    },
    age: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    //runSettersOnQuery: true
  }
);
/*userSchema.pre('save', async function(next) {
const user = this
console.log(user);
user.Password = await bcrypt.hash(user.Password,8)
    next()

});*/
module.exports = mongoose.model("User", User);
