if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./model/user');

//Routes.
const userRoutes=require('./route/user');
const taskRoutes=require('./route/task');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));

//session configure
const sessionConfig={
    secret:'weneedsomebettersecret',
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionConfig));
app.use(flash());
//initialize the passport and session
app.use(passport.initialize());
app.use(passport.session());

//configure the passport.
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for the flash.
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})

//connect to the database.
mongoose.connect('mongodb://localhost:27017/taskApp', 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify:false
})
.then(()=>{
    console.log("Database Connected");
})
.catch((e)=>{
    console.log("Error Occured");
});

app.use(userRoutes);
app.use(taskRoutes);

app.get('/',(req,res)=>{
    res.render('index');
})



app.listen(3000,()=>{
    console.log("Server is listening");
})