const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Login = require("../models/login").Login;
const ResetPassword = require("../models/resetpassword").ResetPassword;
router.get("/:resetToken", async (req, res) => {
  const token = req.params.resetToken;
  console.log(token);
  let resetps = await ResetPassword.findOne({
    $and: [
      { reset_token: token },
      { expired_at: { $gte: Date.now() } },
      { is_used: false }
    ]
  });
  if (!resetps) {
    return res.send({ status: "false", message: "Invalid token." });
  }
  return res.redirect("http://localhost:3000/resetpassword");
  // return res.send({ status: "true", reset_token: token });
});

router.post("/", async (req, res) => {
  const token = req.body.reset_token;
  let resetps = await ResetPassword.findOne({
    $and: [
      { reset_token: token },
      { expired_at: { $gte: Date.now() } },
      { is_used: false }
    ]
  });
  console.log(resetps);
  let userfound = await Login.findOne({ email_id: req.body.email_id });
  if (resetps && userfound) {
    user = new Login(_.pick(req.body, ["email_id", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    Login.updateOne(
      { email_id: user.email_id },
      { $set: { password: user.password } },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(200).send({
            status: "false",
            message: "Invalid password reset request"
          });
        }
        if (!err) {
          ResetPassword.updateOne(
            { email_id: user.email_id },
            { $set: { is_used: true } },
            { new: true },
            (err, result) => {
              if (err) {
                return res.status(200).send({
                  status: "false",
                  message: "Invalid password reset request"
                });
              }
              if (!err) {
                return res.send({
                  status: "true",
                  message: "Succesfully updated password...."
                });
              }
            }
          );
        }
      }
    );
  } else return res.send({ status: "false", message: "Invalid token" });
});

module.exports = router;
