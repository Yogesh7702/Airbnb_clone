 module.user = require("../models/user.js");

 module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports. signup = async(req, res) => {
   try {
     let {username, email, password} = req.body;
     const newuser = new user({email, username});
     const registereduser = await user.register(newuser, password);
     req.login(registereduser, (err) => {
       if(err) {
       return next(err);
     }
     req.flash("success", "welcome to wanderlust");
     res.redirect("/listings");
     })
   
   }
    catch(e) {
     req.flash("error", e.message);
     res.redirect("/signup");
    }
   };

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
  }

module.exports.login = async(req, res) => {
       req.flash("success", "Welcome back to wanderlust");
       let redirectUrl = res.locals.redirectUrl || "/listings";
      
       if (!redirectUrl || redirectUrl === "/login" || redirectUrl === "/") {
      redirectUrl = "/listings";
    }
       res.redirect(redirectUrl);
  };

module.exports.logout = (req, res) => {
    req.logout((err) => {
      if(err) {
        return next(err);
      }
      req.flash("success", "you are logged out !");
      res.redirect("/listings");
    })
  };