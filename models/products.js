const mongoose = require("mongoose");
const Business_Master = require("./business_master").Business_Master;
const Product_Master = require("./product_master").Product_Master;
var random = require('mongoose-random');

const productSchema = new mongoose.Schema({
  business_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business_Master"
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product_Master"
  },
  price: Number,
  is_packed: {
    type: Boolean,
    default: true
  },
  is_available: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
});
productSchema.plugin(random, {
  path: 'r'
});
const Products = mongoose.model("Products", productSchema);
exports.Products = Products;