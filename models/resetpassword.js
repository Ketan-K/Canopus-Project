const mongoose = require("mongoose");
const resetpaswordSchema = new mongoose.Schema({
  email_id: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  reset_token: {
    type: String,
    required: true
  },
  expired_at: {
    type: Date,
    default: Date.now() + 86400000
  },
  is_used: {
    type: Boolean,
    default: false
  }
});
const ResetPassword = mongoose.model("ResetPassword", resetpaswordSchema);
exports.ResetPassword = ResetPassword;
