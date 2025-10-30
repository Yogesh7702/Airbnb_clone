// routes/user.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Signup form
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// Signup post
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password); // passport-local-mongoose
    // login after signup
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome, ${registeredUser.username}!`);
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup");
  }
});

// Login form
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Login handler
router.post(
  "/login",
  (req, res, next) => {
    console.log("🟢 Login attempt with body:", req.body);
    next();
  },

  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    // On success passport will set req.user and session
     console.log("✅ Passport authentication success!");
    console.log("req.user after login:", req.user);
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect("/listings");
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
