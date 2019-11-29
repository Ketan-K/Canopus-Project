const mongoose = require('mongoose');
const business_master = require('./business_master').Business_Master;
const business_catagory_schema = new mongoose.Schema({
    business_catagory_name: String,
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
})
const Business_Catagory = mongoose.model("Business_Catagory", business_catagory_schema);
exports.Business_Catagory = Business_Catagory;