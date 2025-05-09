const User = require("../models/user");
const flash = require("connect-flash");
const { route } = require("./listing");

module.exports.renderSignupform=(req,res)=>{
    res.render("./users/signup.ejs");
}
module.exports.userSignup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser= new User({email,username});
        const registeredUser= await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.userLogin=async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
};

module.exports.userLogout=(req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you are logged out!");
      res.redirect("/listings");
    });
};