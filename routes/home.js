const express = require("express");
const router = express.Router();
const _ = require("lodash");

const User_Master = require("../models/user_master").User_Master;
const User_Address = require("../models/user_address").User_Address;
const Product_Catagory = require("../models/product_catagory").Product_Catagory;
router.get("/header/:uid", async (req, res) => {
    User_Master.findOne({
            email_id: req.params.uid
        },
        async function (err, user) {
            if (user) {
                //console.log(user);
                let pin = await User_Address.findById(user.default_address).select(
                    "pin_code -_id"
                );
                var userdtls = _.pick(user, ["first_name", "last_name", "gender"]);
                userdtls["catagories"] = await Product_Catagory.find().select('product_catagory_name');
                userdtls["cartcount"] = 0;
                userdtls["pin_code"] = 411007;
                if (pin) userdtls["pin_code"] = pin.pin_code;
                res.send({
                    status: true,
                    userinfo: userdtls
                });
            } else {
                res.send({
                    status: false,
                    message: "Unknown User"
                });
            }
        }
    );
});
module.exports = router;