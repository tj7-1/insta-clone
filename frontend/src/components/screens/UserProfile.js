import React, { useEffect,useState, useContext } from 'react';
import { UserContext } from "../../App";
import { useParams } from 'react-router';
const Profile=()=>{
    const [userProfile, setProfile] = useState(null)
    const {state,dispatch}=  useContext(UserContext);

    const {userid}= useParams()
    const [showfollow,setshowfollow]=useState(state?!state.following.includes(userid):true);
    console.log(userid);
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            setProfile(result)
        })
    },[])

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("users",JSON.stringify(data));
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]    //overwritting the followers field of the user that is not logged in
                    }
                }
            })
            setshowfollow(false);
        })
    }

    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data);
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("users",JSON.stringify(data));
            
            setProfile((prevState)=>{
                const newFollower= prevState.user.followers.filter(item=>item!== data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower   //overwritting the followers field of the user that is not logged in
                    }
                }
            })
            setshowfollow(true);
        })
    }


    return(
        <>
        { userProfile? 
            <div>
        <div style={{display:"flex", alignItems:"center",margin:"10px"}}>
            <div>
                <img  src={userProfile.user.pic} alt="" style={{width:"160px", height:"160px",borderRadius:"80px" }}/>
            </div>
            <div>
                <h4 style={{margin:"10px"}}>{userProfile.user.name}</h4>
                <div style={{display:"flex", alignItems:"center"}}>
                    <h5 style={{margin:"10px"}}>{userProfile.posts.length} posts</h5>
                    <h5 style={{margin:"10px"}}>{userProfile.user.followers.length} followers</h5>
                    <h5 style={{margin:"10px"}}>{userProfile.user.following.length} following</h5>
                </div>
                {showfollow
                    ?
                    <button type="submit" className="btn" onClick={()=>followUser()}>follow</button>
                    :
                    <button type="submit" className="btn" onClick={()=>unfollowUser()}>unfollow</button>
                 }
                
                
            </div>
        </div>
        <div className="gallery">
        {
            userProfile.posts.map(item=>{
                return(
                    <img key={item._id} src={item.photo} alt="" style={{width:"160px", height:"160px",margin:"10px"}}/>
                )
                })
        }
            
            
        </div>
        </div>
        :<h2>loading...</h2>}
        
        </>
    )
}
export default Profile;
