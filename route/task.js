require('dotenv').config();
const express=require('express');
const router=express.Router();
const multer=require('multer');
const Task=require('../model/task');
const User=require('../model/user');
const {isLoggedIn}=require('../middleware');
const nodemailer=require('nodemailer');


//define the storage.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/task');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname);
    },
});
//upload the file.
const upload=multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*10
    },
});


//get all employee
router.get('/tasks',isLoggedIn,async(req,res)=>{
    try{
        const employees=await User.find({role:"employee"});
        res.render("tasks/show",{employees});
    }
    catch(err){
        req.flash('error',"Cannot find all the User");
        res.redirect('/');   
    }
});


//get the form for creating new task.
router.get('/tasks/:id',async(req,res)=>{
    try{
        const employee=await User.findById(req.params.id);
        res.render('tasks/new',{employee});
    }
    catch(err){
        req.flash('error',"Cannot find  the User");
    }
});

//creating the task for employee.
router.post('/tasks/:id',upload.single('image'),async(req,res)=>{
   const task= new Task({
       title:req.body.title,
       file:req.file.filename,
       desc:req.body.desc,
       owner:req.params.id
   });
   try{
       await task.save();
       const user=await User.findById(req.params.id);
       let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
       });
       var mailOptions = {
        from: process.env.USER,
        to: user.email,
        subject: 'Sending Email regarding task',
        text: `A New Task has been assigned to you.`
               
       };
       transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
       });

       req.flash('success',"Task Assigned Successfully");
       res.redirect('/tasks');
   }
   catch(err){
        req.flash('error',"Cannot assigned the task");
   }
});

//get the task of employee.
router.get('/user/:id/tasks',async(req,res)=>{
    try{
        const tasks=await Task.find({owner:req.params.id});
        res.render("tasks/employee",{tasks});
    }
    catch(e){
        req.flash('error','Cannot find the tasks');
        
    }
    
})







module.exports=router;


