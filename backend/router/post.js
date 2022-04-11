const express=require('express');
const requirelogin = require('../middleware/requirelogin');
const router=express.Router();
const post=require('../schemas/post');

router.get('/allpost',requirelogin,(req,res)=>{
    post.find()
    
    .populate("comments.postedBy","_id name")
    .populate('postedBy',"_id name")
    .sort('-createdAt')     //to sort the created posts on descending order eg latest on upward
    .then(allposts=>{
        res.json({allposts})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/getsubpost',requirelogin,(req,res)=>{

    //if postedBy is in following then return the post
    post.find({postedBy:{$in:req.user.following}})
    
    .populate("comments.postedBy","_id name")
    .populate('postedBy',"_id name")
    .sort('-createdAt')
    .then(allposts=>{
        res.json({allposts})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/createpost',requirelogin,(req,res)=>{
    const {title,body,picture}=req.body;
    if(!title || !body || !picture){
        return res.status(422).json({errr:"Please add all the fields"});
    }
    req.user.password=undefined;

    const posts=new post({
        title,
        body,
        photo:picture,
        postedBy:req.user
    })
    posts.save()
    .then(result=>{
        res.json({posts:result})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/mypost',requirelogin,(req,res)=>{
    post.find({postedBy:req.user._id})
    .populate('postedBy',"_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.put('/like',requirelogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postId,{
        $push:{like:req.user._id}
    },{
        new:true
    })
    
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({errr:"Error"});
        }
        else{
            res.json(result)
        }
    })
})

router.put('/unlike',requirelogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postId,{
        $pull:{like:req.user._id}
    },{
        new:true
    })
    
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({errr:"Error"});
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment',requirelogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({errr:err});
        }
        else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requirelogin,(req,res)=>{
    post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({errr:err});
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){   //because the type of both of them is object and === will never become true so we converted it into string
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        }
    })
})


module.exports=router;