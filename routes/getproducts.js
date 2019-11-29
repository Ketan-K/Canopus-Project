const express = require("express");
const router = express.Router();
const User_Master = require("../models/user_master").User_Master;
const Product_Master = require("../models/product_master").Product_Master;
const Product_Catagory = require("../models/product_catagory").Product_Catagory;
const Business_Master = require("../models/business_master").Business_Master;
var Products = require("../models/products").Products;
router.get("/random", async (req, res) => {
  var randomElement = await Products.findRandom()
    .select("product_id business_id is_packed price is_available _id")
    .limit(12)
    .populate({
      path: "product_id",
      select: "product_name unit_of_measurement -_id"
    })
    .populate({
      path: "business_id",
      select: "business_name -_id"
    });
  if (!randomElement)
    return res.send({
      status: "False",
      message: "Something went wrong" + err
    });
  else {
    res.send({
      status: "true",
      product_name: randomElement
    });
  }
});

router.get("/productdescription/:id", async (req, res) => {
  Products.findById(req.params.id, function (err, prod) {
      if (err) {
        return res.send({
          status: "false",
          message: "Product not found"
        });
      } else
        return res.send({
          status: "true",
          product: prod
        });
    })
    .populate({
      path: "product_id",
      select: "product_name unit_of_measurement description -_id"
    })
    .populate({
      path: "business_id",
      select: "business_name -_id"
    });
});
router.get("/listbycatagory/:catname", (req, res) => {
  Product_Catagory.find({
      product_catagory_name: req.params.catname
    })
    .select("_id")
    .then(async pid => {
      Product_Master.find({
          product_catogery_id: pid
        })
        .select("_id:1")
        .exec()
        .then(pids => {
          Products.find({
              product_id: {
                $in: pids
              }
            })
            .select("product_id business_id is_packed price is_available _id")
            .populate({
              path: "product_id",
              select: "product_name description unit_of_measurement -_id"
            })
            .populate({
              path: "business_id",
              select: "business_name -_id"
            })
            .then(data => {
              if (!data)
                return res.send({
                  status: "false",
                  message: "Something went wrong." + err
                });
              else {
                return res.send({
                  status: "true",
                  products: data
                });
              }
            })
            .catch(err => {
              return res.send({
                status: "false",
                message: "Something went wrong." + err
              });
            });
        });
    })
    .catch(err => {
      return res.send({
        status: "false",
        message: "category does not exist" + err
      });
    });
});

router.get("/list/:uid", async (req, res) => {
  let user = await User_Master.findOne({
    email_id: req.params.uid
  });
  if (!user) {
    res.send({
      status: false,
      message: "User Not Found.."
    });
  } else {
    Business_Master.findOne({
        shopkeeper_id: user._id
      }, {
        business_name: 1,
      },
      function (err, prods) {
        if (err) {
          return res.send({
            status: false,
            message: "No Products Found.." + err
          });
        } else {
          Products.find({
              business_id: prods._id
            })
            .select("product_id business_id is_packed price is_available _id")
            .populate({
              path: "product_id",
              select: "product_name description unit_of_measurement -_id"
            })
            .populate({
              path: "business_id",
              select: "business_name -_id"
            })
            .then(data => {
              if (!data)
                return res.send({
                  status: "false",
                  message: "Something went wrong." + err
                });
              else {
                return res.send({
                  status: "true",
                  products: data
                });
              }
            })
            .catch(err => {
              return res.send({
                status: "false",
                message: "Something went wrong." + err
              });
            });
        }
      })
  }
});

router.get("/search/:input", (req, res) => {
  Product_Master.find({
      product_name: {
        $regex: req.params.input,
        $options: "i"
      }
    })
    .select("_id:1")
    .exec()
    .then(pids => {
      Products.find({
          product_id: {
            $in: pids
          }
        })
        .select("product_id business_id is_packed price is_available _id")
        .populate({
          path: "product_id",
          select: "product_name description unit_of_measurement -_id"
        })
        .populate({
          path: "business_id",
          select: "business_name -_id"
        })
        .then(data => {
          if (!data)
            return res.send({
              status: "false",
              message: "No product found." + err
            });
          else {
            return res.send({
              status: "true",
              products: data
            });
          }
        })
        .catch(err => {
          return res.send({
            status: "false",
            message: "No product found." + err
          });
        });
    });
});

module.exports = router;