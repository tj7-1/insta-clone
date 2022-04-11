const express=require('express');
const router= express.Router();
const bcrpt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../keys');
const user=require("../schemas/user");
const requirelogin=require('../middleware/requirelogin');

router.get('/',(req,res)=>{
    res.send("Home");
});

router.post('/signup',(req,res)=>{
    const {name,email,password,pic}= req.body;
    if(!name || !email || !password){
        return res.status(422).json({error:"Please add all the fields"});
    }
    user.findOne({emai:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"Email already exist"});
        }

        bcrpt.hash(password,12)
        .then(hashedpassword=>{
            const Users=new user({
                name,
                email,
                password:hashedpassword,
                pic
            })
            Users.save()
            .then(users=>{
                res.json({message:"Saved Successfully"});
            })
            .catch(err=>{
                console.log(err);
            })
        })
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/login',(req,res)=>{
    const{email,password}=req.body;

    if(!email || !password){
        return res.status(422).json({error:"Please add all the fields"});
    }
    user.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"});
        }
        bcrpt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic}=savedUser;
                res.json({token,users:{_id,name,email,followers,following,pic}});
            }
            else{
                return res.status(422).json({error:"Please add correct email and password"});
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
})

router.get('/protected',requirelogin,(req,res)=>{
    res.send("Hello");
})

module.exports=router;