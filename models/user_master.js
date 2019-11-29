const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const user_address = require("./user_address").User_Address;
const user_master = new mongoose.Schema({
  email_id: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    //required: true,
    //minlength: 5,
    maxlength: 50
  },
  last_name: {
    type: String,
    //required: true,
    //minlength: 5,
    maxlength: 50
  },
  mobile_number: {
    type: Number,
    // required: true
  },
  gender: {
    type: String,
    enum: ["male", "female", "transgende"],
    // required: true
  },
  date_of_birth: {
    type: Date,
    // required: true
  },
  default_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_address'
  },
  address: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_address'
  }],
  aadhar_number: {
    type: Number,
    //required: true,
    // unique: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_adhar_verified: {
    type: Boolean,
    default: false
  },
  role_name: {
    type: String,
    default: "customer"
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

user_master.methods.generateAuthToken = function () {
  const token = jwt.sign({
    email_id: this.email_id
  }, config.get("jwtPrivateKey"));
  return token;
};
const User_Master = mongoose.model("User_Master", user_master);
exports.User_Master = User_Master;