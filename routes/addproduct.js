const express = require("express");
const router = express.Router();
const path = require("path");
const upload = require("express-fileupload");
const xlsx = require("xlsx");
const Product_Master = require("../models/product_master").Product_Master;
const Product_Catagory = require("../models/product_catagory").Product_Catagory;
const User_Master = require("../models/user_master").User_Master;
const Business_Master = require("../models/business_master").Business_Master;
const Products = require("../models/products").Products;
router.get("/get/:filename", (req, res) => {
  res.redirect("/api/addproduct/download/" + req.params.filename);
});
router.get("/download/", (req, res) => {
  var file = "ProductList.xlsx";
  var fileLocation = path.join("./config", file);
  console.log(fileLocation);
  res.download(fileLocation, file);
});
router.use(
  upload({
    useTempFiles: true,
    tempFileDir: "./config/"
  })
);
router.post("/upload/", (req, res) => {
  if (req.files) {
    var file = req.files.file,
      filename = "ProductList.xlsx";
    file.mv("./config/" + filename, function (err) {
      if (err) {
        console.log(err);
        res.send("Error occured..!");
      } else {
        res.redirect(
          "/api/addproduct/parsefile/" + req.body.email_id + "/" + filename
        );
      }
    });
  } else res.send("file not found..");
});

router.get("/parsefile/:uid/:filename", async (req, res) => {
  const workbook = xlsx.readFile("./config/" + req.params.filename);
  const sheet_names = workbook.SheetNames;
  var count = 0;
  try {
    let user = await User_Master.findOne({
      email_id: req.params.uid
    });
    if (!user) {
      res.send({
        status: false,
        message: "User Not Found.."
      });
    } else {
      var business = await Business_Master.findOne({
        shopkeeper_id: user
      });

      const products = sheet_names.forEach(async prod_cat_name => {
        const products = xlsx.utils.sheet_to_json(workbook.Sheets[prod_cat_name]);
        let prod_cat = await Product_Catagory.findOne({
          product_catagory_name: prod_cat_name
        });
        if (!prod_cat) {
          prod_cat = Product_Catagory({
            product_catagory_name: prod_cat_name
          });
          prod_cat.save();
        }
        products.forEach(product => {
          var prod = new Product_Master({
            product_catogery_id: prod_cat.id,
            product_name: product.Product_Name,
            description: product.Description,
            unit_of_measurement: product.Unit_of_Measurement
          });
          var tprod = new Products({
            product_id: prod._id,
            business_id: business._id,
            price: product.Price
          });
          tprod.save();
          prod.save(async function (err) {
            if (!err) {
              await Business_Master.update({
                  shopkeeper_id: user
                }, {
                  $addToSet: {
                    products: {
                      product: tprod._id
                    }
                  }
                },
                function (err, info) {
                  if (err) console.log(err);
                  else console.log(prod._id);
                }
              );
              console.log("Product" + count++);
            } else console.log(err);
          });
        });
      });
      res.send({
        status: "true",
        message: "Products Added.."
      });
    }
  } catch (err) {
    res.send({
      status: "false",
      message: "File corrupted.."
    });

  }
});

module.exports = router;