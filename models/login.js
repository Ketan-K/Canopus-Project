const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  email_id: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
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
loginSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
    email_id: this.email_id
  }, config.get("jwtPrivateKey"));
  return token;
};
const Login = mongoose.model("Login", loginSchema);

exports.Login = Login;