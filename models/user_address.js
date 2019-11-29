const config = require("config");
const mongoose = require("mongoose");
const user_address_schema = new mongoose.Schema({
  address_line_1: {
    type: String,
    required: true
  },
  address_line_2: String,
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
    required: true,
    default: "india"
  },
  pin_code: {
    type: Number,
    min: 100000,
    max: 999999
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
const User_Address = mongoose.model("User_Address", user_address_schema);
exports.User_Address = User_Address;