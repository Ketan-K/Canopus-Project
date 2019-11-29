const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const login = require("./routes/login");
const forgetpassword = require("./routes/forgetpassword");
const resetpassword = require("./routes/resetpassword");
const addbusiness = require("./routes/addbusiness");
const register = require("./routes/register");
const masterpassword = require("./routes/masterpassword");
const listbusiness = require("./routes/listbusiness");
const addproduct = require("./routes/addproduct");
const getproduct = require("./routes/getproducts");
const home = require("./routes/home");
const cart =require("./routes/cart")

var cors = require('cors');
//var bodyParser = require('body-parser');
const app = express();
//enables cors
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));


app.use(express.json());
mongoose.set("useCreateIndex", true);
mongoose
  .connect(
    "mongodb://canopus:canopus2018@ds135537.mlab.com:35537/canopus-db", {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));
app.use("/api/login", login);
app.use("/api/forgetpassword", forgetpassword);
app.use("/api/resetpassword", resetpassword);
app.use("/api/addbusiness", addbusiness);
app.use("/api/register", register);
app.use("/api/masterpassword", masterpassword);
app.use("/api/listbusiness", listbusiness);
app.use("/api/addproduct", addproduct);
app.use("/api/getproduct", getproduct);
app.use("/api/home", home);
app.use("/api/cart", cart);

app.get("", (req, res) => {
  res.send("Welcome to Canopus World..!")
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
