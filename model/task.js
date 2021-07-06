const mongoose=require('mongoose');
const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    file:{
        type:String
    },
    desc:{
        type:String,
        require:true
    },
    completed:{
        type:Boolean,
        default:false,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

},{
    timestamps:true,
});

const Task=mongoose.model('Task',taskSchema);
module.exports=Task;