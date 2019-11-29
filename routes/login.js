const bcrypt = require("bcryptjs");
const Login = require("../models/login").Login;
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.post("/", async (req, res) => {
  let login = await Login.findOne({
    email_id: req.body.email_id
  });
  if (!login)
    return res.send({
      status: "false",
      verified: "false",
      message: "User not registered."
    });
  else
  if (!login.is_verified)
    return res.send({
      status: "false",
      verified: "false",
      message: "Email is not verified."
    });
  else {
    const validPassword = await bcrypt.compare(req.body.password, login.password);
    if (!validPassword)
      return res.send({
        status: "false",
        verified: "true",
        message: "Wrong password."
      });
    else {
      const token = login.generateAuthToken();
      res
        .status(200)
        .header("x-auth-token", token)
        .send({
          status: "true",
          verified: "true",
          message: "Login successfull."
        });
    }
  }
});
module.exports = router;