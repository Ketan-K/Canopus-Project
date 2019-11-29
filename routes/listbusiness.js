const Business_Master = require("../models/business_master").Business_Master;
const User_Master = require("../models/user_master").User_Master;
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    Business_Master.find()
        .select('-_id business_type business_category_name business_name address_line_1 address_line_2 city state  country  pin_code')
        .populate({ path: 'shopkeeper_id', select: 'first_name last_name -_id mobile_number ' })
        .exec()
        .then(data => {
            if (!data)
                return res.send({
                    status: "false",
                    message: "Something went wrong." + err
                });
            else {
                return res.send({
                    status: "true",
                    shop_list: data
                });
            }
        })
        .catch(err => {
            return res.send({
                status: "false",
                message: "Something went wrong." + err
            });
        })

})

module.exports = router;