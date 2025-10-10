require('dotenv').config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listingRoutes.js");
const reviewRouter = require("./routes/reviewRoutes.js");
const userRouter = require("./routes/userRoutes.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // this means forms can send only url encoded data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
 secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
 

})
store.on("error",()=>{
  console.log("Error in mongo session store", error)
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + (7* 24*60*60*1000),
    maxAge:7*24*60*60*1000,
    httpOnly: true,
  }
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // to store all the info related to user
passport.deserializeUser(User.deserializeUser()); // to remove all the info related to user


app.use((req,res,next)=>{
  res.locals.success =req.flash("success");
  res.locals.failure =req.flash("failure");
  res.locals.currUser= req.user;
  next();
})




app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); // here :id parameter remains in the app,js file and is unable to go to reviewroute file

//route for first page
app.get("/",(rea,res)=>{
  res.render("./listings/firstPage.ejs");
})

//for wrong route
app.use((req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

//middleware for error(app.use ) is used for middlewares
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "somthing went wrong" } = err;
  res.render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listing to 8080");
});


// we will use joi to validate model schema, i.e if we pass in input fields and some field like description is missing it wont allow to send the schema to mongoose
// it define schema
