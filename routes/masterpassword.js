const bcrypt = require("bcryptjs");
const express = require("express");
const Business_Master = require("../models/business_master").Business_Master;
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const User_Master = require("../models/user_master").User_Master;
router.get("/:token", async (req, res) => {
  let token = req.params.token;
  var decode = jwt.decode(token, config.get("jwtPrivateKey"));
  var userId = decode.email_id; // emailId
  console.log(userId)
  var uid = await User_Master.findOne({
    email_id: userId
  }).select('_id');
  await Business_Master.findOne({
    shopkeeper_id: uid
  }, (err, doc) => {
    if (err) {
      return res.send({
        status: "false",
        message: "Invalid request/token."
      });
    } else {
      return res.redirect(
        "http://localhost:3000/masterpassword"
      );
      /*
      return res.send({
        status: "true",
        password_token: token
      });*/
    }
  });
});

router.post("/", async (req, res) => {
  /*let token = req.body.password_token;
  var decode = jwt.decode(token, config.get("jwtPrivateKey"));
  var user_id = decode.email_id;*/
  var user_id = "ketankatore@gmail.com";
  var masterpassword = req.body.password;
  const salt = await bcrypt.genSalt(10);
  masterpassword = await bcrypt.hash(masterpassword, salt);
  var uid = await User_Master.findOne({
    email_id: user_id
  }).select('_id');

  Business_Master.updateOne({
      shopkeeper_id: uid
    }, {
      $set: {
        master_password: masterpassword
      }
    }, {
      new: true
    },
    (err, result) => {
      if (err) {
        return res.send({
          status: "false",
          message: "Not able to update password." + err
        });
      } else {
        return res.send({
          status: "true",
          message: "Succesfully updated password."
        });
      }
    }
  );
});
module.exports = router;