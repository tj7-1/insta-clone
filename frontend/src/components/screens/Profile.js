import React, { useEffect,useState, useContext } from 'react';
import { UserContext } from "../../App";

const Profile=()=>{
    const [pics, setPics] = useState([])
    const [image,setImage]=useState("");
    const [url,setUrl]=useState(undefined);
    const {state,dispatch}=  useContext(UserContext);
   
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            setPics(result.mypost);
        })
    },[])

    useEffect(()=>{
        if(url){
            fetch('/updatepic',{
                            method:"put",
                            headers:{
                                "Content-Type":"application/json",
                                "Authorization":"Bearer "+localStorage.getItem("jwt")
                            },
                            body:JSON.stringify({
                                pic:url
                            })
                        }).then(res=>res.json())
                        .then(result=>{
                            console.log(result);
                            dispatch({type:"UPDATEPIC",payload:result.pic})
                            localStorage.setItem("users",JSON.stringify({...state,pic:result.pic}))
                        })
        }
    },[url])

    const UpdatePicture=()=>{
        const data= new FormData();
        data.append("file",image);
        data.append("upload_preset","instagramclone");
        data.append("cloud_name","dkvep8mvb");
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

    // useEffect(() => {
    //     if(image){
    //     const data= new FormData();
    //     data.append("file",image);
    //     data.append("upload_preset","instagramclone");
    //     data.append("cloud_name","dkvep8mvb");
    //     fetch("	https://api.cloudinary.com/v1_1/dkvep8mvb/image/upload",{
    //         method:"post",
    //         body:data
    //     })
    //     .then(res=>res.json())
    //     .then(data=>{
    //         setUrl(data.url);
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //     })
    //     }
    // }, [image])

    // const UpdatePicture=()=>{
    //     fetch('/updatepic',{
    //             method:"put",
    //             headers:{
    //                 "Content-Type":"application/json",
    //                 "Authorization":"Bearer "+localStorage.getItem("jwt")
    //             },
    //             body:JSON.stringify({
    //                 pic:url
    //             })
    //         }).then(res=>res.json())
    //         .then(result=>{
    //             console.log(result);
    //             dispatch({type:"UPDATEPIC",payload:result.pic})
    //             localStorage.setItem("users",JSON.stringify({...state,pic:result.pic}))
    //         })
    // }
    return(
        <>
        <div>
        <div style={{display:"flex", alignItems:"center",margin:"10px"}}>
            <div>
                <img  src={state?state.pic:"Loading"} alt="" style={{width:"160px", height:"160px",borderRadius:"80px" }}/>
            </div>
            <div>
                <h4 style={{margin:"10px"}}>{state?state.name:"loading"}</h4>
                <div style={{display:"flex", alignItems:"center"}}>
                    <h5 style={{margin:"10px"}}>{pics.length} posts</h5>
                    <h5 style={{margin:"10px"}}>{state?state.followers.length:"Loading"} followers</h5>
                    <h5 style={{margin:"10px"}}>{state?state.following.length:"Loading"} following</h5>
                </div>
                
                
                    <input className="file-btn" type="file" onChange={(event)=>setImage(event.target.files[0])}/>
                    <button type="submit" className="btn" onClick={()=>UpdatePicture()} >Update Picture</button> 
            </div>
        </div>
        <div className="gallery">
        {
            pics.map(item=>{
                return(
                    <img key={item._id} src={item.photo} alt="" style={{width:"160px", height:"160px",margin:"10px"}}/>
                )
                })
        }
            
            
        </div>
        </div>
        </>
    )
}
export default Profile;
