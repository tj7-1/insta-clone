const mongoose=require('mongoose');
const validator= require('validator');
const {ObjectId}= mongoose.Schema.Types
const Users=require('./user');
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid Email")
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dkvep8mvb/image/upload/v1626519124/thumb_15951118880user_bkxjlp.png"
    },
    followers:[
        {
            type:ObjectId,
            ref:Users
        }
    ],
    following:[
        {
            type:ObjectId,
            ref:Users
        }
    ],
})

const user=new mongoose.model('user',userSchema);

module.exports=user;