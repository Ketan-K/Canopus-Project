const mongoose = require("mongoose");
const User_Master = require("./user_master").User_Master;
const Product_Master = require("./product_catagory").Product_Master;
const Business_Catagory = require("./business_catagory").Business_Catagory;
const Products = require("./products").Products;
const business_master_schema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_Master"
  },
  shopkeeper_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_Master"
  },
  business_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business_Catagory"
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
      }
    }
  ],
  shop_user_name: String,
  shop_password: String,
  master_password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  password_token: String,
  shop_documnet_folder_path: String,
  business_category_name: {
    type: String,
    required: true
  },
  business_type: {
    type: String,
    required: true
  },
  business_name: {
    type: String,
    required: true
  },
  address_line_1: {
    type: String,
    required: true
  },
  address_line_2: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: "India",
    required: true
  },
  pin_code: {
    type: Number,
    min: 100000,
    max: 999999,
    require: true
  },
  phone_number: {
    type: Number,
    // min: 1000000000,
    max: 9999999999
  },
  is_active: {
    type: Boolean,
    default: false
  },
  is_verified: {
    type: Boolean,
    default: false
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

const Business_Master = mongoose.model(
  "Business_Master",
  business_master_schema
);
exports.Business_Master = Business_Master;
