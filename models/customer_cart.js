const mongoose = require("mongoose");
const User_Master = require('./user_master').User_Master;
const Product_Master = require('./product_catagory').Product_Master;
const customerCartSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, 
          ref: 'User_Master' 
      },
    products: [{
        product_id:{ type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product_Master' 
      },
      price: Number,
      quantity:{ 
        type : Number,
        default : 1
        },
        created_at: {
          type: Date,
          default: Date.now()
        },
        updated_at: {
          type: Date,
          default: Date.now()
        }
      } ],
});

const Customer_Cart = mongoose.model("customer_cart",customerCartSchema);
exports.Customer_Cart = Customer_Cart;
