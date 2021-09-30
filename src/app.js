const express=require("express");
//const sequelize=require("./backend/databases/sqlite.js")
const bodyParser=require("body-parser")
const session = require('express-session')
const cookieParser=require("cookie-parser");
const cors = require("cors");
const compression = require("compression");

const path = require("path");
const logger = require("morgan");
const port = process.env.port||4000;
const app=express();
const router=require("./backend/routes/route")

////////////////////////////////////////////
//sequelize.sync().then(()=>console.log("db is ready...")).catch((err)=>{console.log(err)});

app.use(cors()); //Line1

app.use(compression()); //Line2

app.use(bodyParser.urlencoded({ extended: true })); //Line3

app.use(bodyParser.json()); //Line4

app.use(cookieParser());
const SESS_NAME="todo";
app.set("view engine", "ejs"); //Line7
app.engine("html", require("ejs").renderFile); //Line6
app.set("views", __dirname + "/client/views"); //line5

// ejs - for rendering ejs in html format

// setting view-engine as ejs

app.use(express.static("./client"));

app.use("/images",express.static(path.resolve(__dirname, "client/images"))); //Line8
app.use("/css",express.static(path.resolve(__dirname, "client/css")));

// // for logging purposes
app.use(logger("dev")); //Line9

// Session Setup
app.use(session({

    name: SESS_NAME,
    // It holds the secret key for session
    secret: 'Your_Secret_Key',
  
    // Forces the session to be saved
    // back to the session store
    resave: false,
  
    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*10,
         sameSite:true,
         secure:false
    }
}))


//normal functions

app.use("/",router)

//  app.use("/signin",router);

//  app.use("/signup",router);

//  app.use("/add",router)

//  app.use("/logout",router)

 //app.use("")
app.listen(port,()=>{
    console.log("App is listening on port ",port);
})

module.exports = app;