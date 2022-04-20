const path = require("path");
const sgMail = require("@sendgrid/mail");
const { Console } = require("console");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
sgMail.setApiKey(process.env.API_KEY);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const ServiceSid = process.env.MESSAGING_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);
const generate = require("random-otp");

function generateOTP() {
  console.log("1");
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
var otp;
const otptoSms = async (req, res, PhoneNumber) => {
  res.otp = generateOTP();
  const number = "+91" + PhoneNumber;
  await client.messages
    .create({
      body:
        "Your OTP is " +
        res.otp +
        " your otp will expires in 5 mins   -Team SnapChat",
      //from: '+19377613900',
      messagingServiceSid: ServiceSid,
      to: number,
    })
    .then((message) => console.log("OTP sent to Mobile Number"));
};
const otptoEmail = async (req, res, email) => {
  res.otp = generateOTP();
  const msg = {
    to: email,
    from: {
      name: "Team SnapChat",
      email: "navenaveenkumar.00@gmail.com",
    },
    subject: "OTP Verification",
    text:
      "Your OTP is " +
      res.otp +
      " your otp will expires in 5 mins   -Team SnapChat",
    html:
      "<strong>Your OTP is " +
      res.otp +
      " your otp will expires in 5 mins   -Team SnapChat</strong>",
  };
  await sgMail
    .send(msg)
    .then(() => {
      console.log(" Email  OTP sent");
    })
    .catch((error) => {
      console.log("Email Not delivered");
    });
};

module.exports = { otptoSms, otptoEmail };
