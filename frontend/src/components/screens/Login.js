import React, { useState , useContext } from "react";
import { Link, useHistory } from 'react-router-dom';
import {UserContext} from '../../App';

const Login = () => {

    const {state,dispatch}= useContext(UserContext);
    const history=useHistory();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const PostData=()=>{
        fetch('/login',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                console.log("Error");
            }
            else{
                
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("users",JSON.stringify(data.users));
                dispatch({type:"USER",payload:data.users})
                history.push('/');
            }
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
                        <input type="email" placeholder="Email" className="input-2" id="input-2" value={email} onChange={(event)=>setEmail(event.target.value)}/>
                        <input type="password" placeholder="Password" className="input-3" id="input-3" value={password} onChange={(event)=>setPassword(event.target.value)}/>
                        <button type="submit" className="btn" onClick={()=>PostData()} >Login</button>
                    </div>
                </div>
                <div className="sub-content">
                    <div className="s-part">
                        Don't have an account?<Link className="s-part-text" to="/Signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Login;