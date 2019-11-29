const nodemailer = require("nodemailer");
const config = require("config");
const transporter = nodemailer.createTransport({
  service: config.get("myEmailService"),
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: config.get("myEmail"),
    pass: config.get("myEmailPassword")
  }
});
exports.transporter = transporter;
