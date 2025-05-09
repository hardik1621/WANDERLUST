if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRoute=require("./routes/listing.js");
const reviewRoute= require("./routes/review.js");
const Listing=require("./models/listing.js");
const session=require("express-session");
const MongoStore= require("connect-mongo");
const flash= require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js");
const userRoute=require("./routes/user.js");


app.listen(8080, ()=>{
    console.log("server is listening");
});



const dbUrl= process.env.ATLASDB_URL;
main().then(()=>{
    console.log(dbUrl)
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);



const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24* 3600,
})

store.on("error",(err)=>{
    console.log("Error in mongo session store",err);
})

const sessionOptions= {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly:true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.use(express.static(path.join(__dirname,"/public")));

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);


app.get("/", async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
})





//MIDDLEWARES
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500 ,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
})



