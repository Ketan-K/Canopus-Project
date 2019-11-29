const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Login = require("../models/login").Login;
const User_Master = require("../models/user_master").User_Master;
const User_Address = require("../models/user_address").User_Address;
const transporter = require("../models/mail").transporter;
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const config = require("config");



router.post("/", async (req, res) => {
  let user = await User_Master.findOne({
    email_id: req.body.email_id
  });
  if (user)
    return res.send({
      status: "false",
      message: "User already registred"
    });
  user = await User_Master({
    email_id: req.body.email_id,
    mobile_number: req.body.mobile_number,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    // gender: req.body.gender,
  });
  const token = user.generateAuthToken();
  console.log(token);
  const mailData = {
    to: user.email_id,
    from: config.get("myEmail"),
    subject: "Verify User Acccount...!",
    text: "Click the Following link to to verify your user account..\n\n\thttps://canopus-api.herokuapp.com/api/register/verifyemail/" +
      token
  };
  user.save(async function (err) {
    if (err) {
      return res.send({
        status: "false",
        message: "Something went wrong." + err
      });
    } else {
      let user = new Login(_.pick(req.body, ["email_id", "password"]));
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(user.password, salt);
      await user.save(function (err) {
        if (err) {
          return res.send({
            status: "false",
            message: "Something went wrong." + err
          });
        } else {
          transporter.sendMail(mailData, function (err) {
            if (!err) {
              return res.send({
                status: "true",
                message: "Verification link send to your email."
              });
            }
            if (err)
              return res.send({
                status: "false",
                message: "Something went wrong." + err
              });
          });
        }
      })
    }
  });
})


router.post("/pre", async (req, res) => {
  let user = await User_Master.findOne({
    email_id: req.body.email_id
  });
  if (user)
    return res.send({
      status: "false",
      message: "User already registred"
    });
  user = await User_Master({
    email_id: req.body.email_id,
    mobile_number: req.body.mobile_number
  });
  const token = user.generateAuthToken();
  console.log(token);
  const mailData = {
    to: user.email_id,
    from: config.get("myEmail"),
    subject: "Verify User Acccount...!",
    text: "Click the Following link to to verify your user account..\n\n\thttps://canopus-api.herokuapp.com/api/register/verifyemail/" +
      token
  };
  user.save(function (err) {
    if (err) {
      return res.send({
        status: "false",
        message: "Something went wrong." + err
      });
    } else {
      transporter.sendMail(mailData, function (err) {
        if (!err) {
          return res.send({
            status: "true",
            message: "Verification link send to your email."
          });
        }
        if (err)
          return res.send({
            status: "false",
            message: "Something went wrong." + err
          });
      });
    }
  });
});

router.get("/verifyemail/:token", async (req, res) => {
  let token = req.params.token;
  console.log(token);
  try {
    var decode = jwt.decode(token, config.get("jwtPrivateKey"));
  } catch (err) {
    console.log("Error");
    return res.send({
      status: false,
      message: "Invalid token"
    });
  }
  console.log(decode);
  var userId = decode.email_id; // emailId
  console.log(userId);
  await Login.findOneAndUpdate({
      email_id: userId
    }, {
      $set: {
        is_verified: true
      }
    },
    (err, doc) => {
      if (!doc) {
        return res.send({
          status: false,
          message: "User Not Exist"
        });
      } else {
        if (doc.is_verified) {
          return res.send({
            status: false,
            message: "User already verified.."
          });
        } else
          return res.redirect("http://localhost/login")
        /*
          return res.send({
            status: true,
            message: "verified...!"
          });*/
      }
    }
  );
});

router.post("/post", async (req, res) => {
  await User_Master.findOneAndUpdate({
      email_id: req.body.email_id,
      is_verified: true
    }, {
      $set: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        password: req.body.password
      }
    },
    async (err, doc) => {
      if (err)
        return res.send({
          status: false,
          message: "Error...!" + err
        });
      else if (!doc) {
        return res.send({
          status: false,
          message: "User Not Exist"
        });
      } else {
        let user = new Login(_.pick(req.body, ["email_id", "password"]));
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password, salt);
        await user.save(function (err) {
          if (err) {
            return res.send({
              status: "false",
              message: "Something went wrong." + err
            });
          } else
            res.send({
              status: "true",
              message: "Registration Success..!"
            });
        });
      }
    }
  );
});
router.post("/addaddress", async (req, res) => {
  let address = new User_Address({
    address_line_1: req.body.address_line_1,
    address_line_2: req.body.address_line_2,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    pin_code: req.body.pin_code,
  })
  address.save(function (err) {
    if (err) {
      return res.send({
        status: false,
        message: "Address not saved..!" + err
      })
    } else {
      User_Master.update({
        email_id: req.body.uid
      }, {
        $push: {
          address: address._id
        }
      }).exec()
      console.log(req.body.is_default)
      if (req.body.is_default) {
        User_Master.update({
            email_id: req.body.uid
          }, {
            $set: {
              default_address: address._id
            }
          },
          function (err) {
            if (!err)
              return res.send({
                status: true,
                message: "Address saved as deafault successfully..!"
              })
            else {
              return res.send({
                status: false,
                message: "Address not saved..!" + err
              })
            }
          }
        )
      } else
        return res.send({
          status: true,
          message: "Address saved successfully..!"
        })
    }
  })
});

module.exports = router;