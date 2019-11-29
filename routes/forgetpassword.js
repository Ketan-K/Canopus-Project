const bcrypt = require("bcryptjs");
const Login = require("../models/login").Login;
const ResetPassword = require("../models/resetpassword").ResetPassword;
const transporter = require("../models/mail").transporter;
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const config = require("config");

router.post("/", async (req, res) => {
  let login = await Login.findOne({ email_id: req.body.email_id });
  if (!login)
    return res.send({ status: "false", message: "Invalid email or password." });
  const token = login.generateAuthToken();
  const mailData = {
    to: login.email_id,
    from: config.get("myEmail"),
    subject: "Password help has arrived!",
    text:
      "Click the Following link to reset your password..\n\n\thttps://canopus-api.herokuapp.com/api/resetpassword/" +
      token
  };
  console.log("Sending mail.....");
  const resetpasswordschema = new ResetPassword({
    email_id: login.email_id,
    reset_token: token,
    expired_at: Date.now() + 86400000,
    is_used: false
  });
  resetpasswordschema.save(function(err) {
    if (err) {
      console.log("Token not saved...");
      return res.send({
        status: "false",
        message: "Invalid email or password."
      });
    } else
      transporter.sendMail(mailData, function(err, info) {
        if (err) {
          console.log("Email not send......");
          return res.send({
            status: "false",
            message: "Invalid email or password."
          });
        } else return res.status(200).send({ status: "true", message: "Email sent successfully..." });
      });
  });
});

module.exports = router;
