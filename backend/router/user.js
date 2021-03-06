const express=require('express');
const requirelogin = require('../middleware/requirelogin');
const router=express.Router();
const post=require('../schemas/post');
const User= require('../schemas/user');

router.get('/user/:id',requirelogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                res.json({user,posts})
            }
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            console.log(err);
        })
    }
    )
})

router.put('/unfollow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            console.log(err);
        })
    }
    )
})

router.put('/updatepic',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},
        {
        new:true
        },
        (err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                res.json(result);
            }
        })
})

module.exports= router;