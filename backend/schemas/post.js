const mongoose=require('mongoose');
const user=require('./user');

const {ObjectId}= mongoose.Schema.Types

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        require:true
    },
    photo:{
        type:String,
        require:true
    },
    like:[{
        type:ObjectId,
        ref:user
    }],
    comments:[{
        text:String,
        postedBy:{
            type:ObjectId,
            ref:user
        }
    }],
    postedBy:{
        type:ObjectId,
        ref:user
    }
},{timestamps:true})        //to sort the posts

const post=new mongoose.model('post',postSchema);
module.exports=post;