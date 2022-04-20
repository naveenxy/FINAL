const sgMail = require("@sendgrid/mail");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const MESSAGING_SERVICE_ID = process.env.MESSAGING_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);
sgMail.setApiKey(process.env.API_KEY);
var EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
var myEmitter = new MyEmitter();

myEmitter.on("send", (PhoneNumber, EmailId) => {
  const msg = {
    to: EmailId,
    from: {
      name: "Team SnapChat",
      email: "navenaveenkumar.00@gmail.com",
    },
    subject: "Registration Successfull",
    text: "Thanks for signing up with us",
    html: "<strong>Thanks for signing up with us</strong>",
  };
  myEmitter.emit("sam", "Naveen");
  sgMail
    .send(msg)
    .then(() => {
      console.log(" Registration Email sent");
    })
    .catch((error) => {
      console.log("Email Not delivered");
    });
  if (PhoneNumber) {
    client.messages
      .create({
        body: "Your registration has completed Successfully Thank you Team SnapChat",
        from: "+19377613900",
        messagingServiceSid: MESSAGING_SERVICE_ID,
        to: PhoneNumber,
      })
      .then((message) =>
        console.log("Registration Completed Messege Sent" + message)
      );
  }
});

exports.myEmitter = myEmitter;
