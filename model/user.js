const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        require:true
    },
    role:{
        type:String,
    } 
});

userSchema.plugin(passportLocalMongoose);
const User=mongoose.model('User',userSchema);
module.exports=User;

