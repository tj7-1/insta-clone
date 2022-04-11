import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Createpost = () => {

    const history=useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");

    useEffect(() => {
        if(url){
            fetch('/createpost',{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    picture:url
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.error){
                    console.log("Error");
                }
                else{
                    history.push('/');
                }
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }, [url])

    const postDetails=()=>{

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

    return (
        <>
            <div id="wrapper">
                <div className="main-content">
                    <div className="header">
                        <img src="https://i.imgur.com/zqpwkLQ.png" alt="logo" />
                    </div>
                    <div className="l-part">
                        <input type="text" placeholder="Title" className="input-1" id="input-1" value={title} onChange={(event) => setTitle(event.target.value)} />
                        <input type="text" placeholder="Body" className="input-2" id="input-2" value={body} onChange={(event) => setBody(event.target.value)} />
                        <input className="file-btn" type="file" onChange={(event)=>setImage(event.target.files[0])}/>
                        <button type="submit" className="btn" onClick={()=>postDetails()}>Upload</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Createpost;