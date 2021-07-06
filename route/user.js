const express=require('express');
const router=express.Router();
const User=require('../model/user');
const passport=require('passport');

//admin login.
router.get('/admin',(req,res)=>{
    res.render('auth/admin');
});

router.post('/admin', passport.authenticate('local', 
            { 
                failureRedirect: '/login',
                failureFlash:true
            }
    ),(req,res)=>{
        req.flash('success','Login Successfully');
        res.redirect('/');
    }          
);

//get the registration form
router.get('/register',(req,res)=>{
    res.render('auth/signup');
});

//register the user
router.post('/register',async(req,res)=>{
    try{
        const user=new User(
            {   username:req.body.username,
                email:req.body.email,
                role:req.body.role
            });
        const newUser=await User.register(user,req.body.password);
        req.flash('success','Registered Successfully');   
        res.redirect('/login');
    }
    catch(e){
        console.log("Cannot create the User");
        res.redirect('/register');
    }
});

//getting the login form.
router.get('/login',(req,res)=>{
    res.render('auth/login');
});

//login functionality
router.post('/login', passport.authenticate('local', 
            { 
                failureRedirect: '/login',
                failureFlash:true
            }
    ),(req,res)=>{
        req.flash('success','Login Successfully');
        res.redirect('/');
    }          
);

//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Logout Successfully');
    res.redirect('/login');
});






module.exports=router;







