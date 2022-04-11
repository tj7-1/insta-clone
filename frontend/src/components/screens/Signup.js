import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom';

const Signup=()=>{
    const history=useHistory();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState(undefined);


    useEffect(() => {
        if(url){
            uploadFields()
        }
    }, [url])


    const uploadPic=()=>{

        const data= new FormData();
        //from cloudinary
        data.append("file",image);
        data.append("upload_preset","instagramclone");
        data.append("cloud_name","dkvep8mvb");
        //have to append image and upload in the link
        fetch("	https://api.cloudinary.com/v1_1/dkvep8mvb/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const uploadFields=()=>{
        fetch('/signup',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                console.log("Error");
            }
            else{
                history.push('/Login');
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }


    const PostData=()=>{
        if(image){
            uploadPic();
        }
        else{
            uploadFields();
        }
        }




    return(
        <>
        <div id="wrapper">
                <div className="main-content">
                    <div className="header">
                        <img src="https://i.imgur.com/zqpwkLQ.png" alt="logo" />
                    </div>
                    <div className="l-part">
                        <input type="text" placeholder="Username" className="input-1" id="input-1" value={name} onChange={(event)=>setName(event.target.value)}/>
                        <input type="email" placeholder="Email" className="input-2" id="input-2" value={email} onChange={(event)=>setEmail(event.target.value)}/>
                        <input type="password" placeholder="Password" className="input-3" id="input-3" value={password} onChange={(event)=>setPassword(event.target.value)}/>
                        <input className="file-btn" type="file" onChange={(event)=>setImage(event.target.files[0])}/>
                        <button type="submit" className="btn" onClick={()=>PostData()} >Signup</button>
                    </div>
                </div>
                <div className="sub-content">
                    <div className="s-part">
                        Already have an account?<Link className="s-part-text" to="/Login">Login</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Signup;