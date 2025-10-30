 const express = require("express");
 const app = express();
 const users = require("./routes/user.js");

 app.get("/", (req, res) => {
    res.send("hi , i am root !");
 });

 //  index - users

 app.get("/users", (req, res) => {
    res.send("Get for users");
 })

 app.listen(3000, () => {
    console.log("server is working");
 })