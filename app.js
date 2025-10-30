 if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
 console.log(process.env.SECRET);
 }

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");

const User = require("./models/user");
const userRouter = require("./routes/user");
// require listings/review routers as you have them
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");

// ==== DB connect ====
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("DB CONN ERR:", err));

// ==== App config ====
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// ==== Session store (connect-mongo) ====
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET},
  touchAfter: 24 * 3600
});
store.on("error", (err) => {
  console.error("Session store error:", err);
});

const sessionConfig = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: true, // DON'T set while developing on http://localhost
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
};
app.use(flash());

// ==== Passport setup (must be AFTER session middleware) ====

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// IMPORTANT: User must be imported from models (done above)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});


// ==== Debug middleware (after passport.session) ====
app.use((req, res, next) => {
  // helpful debug prints while you fix issues; remove in production
  console.log("=== REQUEST INFO ===");
  console.log("URL:", req.originalUrl);
  console.log("Cookie header present?:", !!req.headers.cookie);
  console.log("SessionID:", req.sessionID);
  console.log("Session object:", req.session);
  console.log("req.user:", req.user);
  console.log("====================");
  next();
});

// ==== Make flash + curruser available in templates ====
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user || null; // safe default null
  next();
});

// ==== Routers ====
app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// ==== Start server ====
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
