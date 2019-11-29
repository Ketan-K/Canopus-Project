const mongoose = require('mongoose');
const product_catagory = require('./product_catagory')
const productSchema = new mongoose.Schema({
    product_catogery_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product_catagory' },
    product_name: String,
    description: String,
    unit_of_measurement: String,
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
})
const Product_Master = mongoose.model("Product_Master", productSchema);
exports.Product_Master = Product_Master;
