const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const config = require("config");
const Business_Master = require("../models/business_master").Business_Master;
const User_Master = require("../models/user_master").User_Master;
const transporter = require("../models/mail").transporter;

router.post("/", async (req, res) => {
    const user_m = new User_Master({
        email_id: req.body.email_id,
        mobile_number: req.body.mobile_no,
        role_name: "shopkeeper"
    });
    let user = await User_Master.findOne({
        email_id: req.body.email_id
    });
    const token = user_m.generateAuthToken();
    const Business_Master_Object = new Business_Master({
        shopkeeper_id: user._id,
        business_category_name: req.body.business_category_name,
        business_type: req.body.business_type,
        business_name: req.body.business_name,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        pin_code: req.body.pin_code,
        phone_number: req.body.phone_number,
        password_token: token,
        is_active: true,
        is_verified: false
    });
    const mailData = {
        to: user_m.email_id,
        from: config.get("myEmail"),
        subject: "Set Master Password...!",
        text: "Click the Following link to set master password for your businesss..\n\n\thttps://canopus-api.herokuapp.com/api/masterpassword/" +
            token
    };
    console.log(Business_Master_Object);
    await Business_Master_Object.save(async function (err, result) {
        if (!err) {
            user = await User_Master.findOne({
                email_id: req.body.email_id
            });
            if (user) {
                transporter.sendMail(mailData, function (err, info) {
                    if (!err) {
                        return res.send({
                            status: "true",
                            message: "Set Master password link send to email."
                        });
                    }
                    if (err)
                        return res.send({
                            status: "false",
                            message: "Something went wrong." + err
                        });

                });
            } else {
                await user_m.save(function (err) {
                    if (!err) {
                        transporter.sendMail(mailData, function (err, info) {
                            if (!err) {
                                return res.send({
                                    status: "true",
                                    message: "Set Master password link send to email."
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
            }
        } else
            return res.send({
                status: "false",
                message: "Something went wrong."
            });
    });
});
module.exports = router;