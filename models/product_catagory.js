const mongoose = require('mongoose');
const Product_Master = require('./product_master').Product_Master;
const product_catagory_schema = mongoose.Schema({
    product_catagory_name: { type: String, unique: true },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
})
const Product_Catagory = mongoose.model("Product_Catagory", product_catagory_schema);
exports.Product_Catagory = Product_Catagory;