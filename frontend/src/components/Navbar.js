import React ,{useContext, useRef, useEffect} from "react";
import { Link, useHistory } from 'react-router-dom';
import {UserContext} from '../App';

const Navbar = () => {


    const {state,dispatch}=useContext(UserContext);
    const history= useHistory();


    const renderList=()=>{
        if(state){
            return[
                <li key="1" className="nav-item">
                <i  className="fas fa-search"></i>
                </li>,
                <li key="2" className="nav-item">
                <Link className="nav-link" to="/Profile">Profile</Link>
                </li>,
                <li key="3" className="nav-item">
                <Link className="nav-link" to="/CreatePost">Create Post</Link>
                </li>,
                <li key="4" className="nav-item">
                <Link className="nav-link" to="/myfollowings">My Followings</Link>
                </li>,
                <li key="5" className="nav-item">
                <button className="nav-link" onClick={()=>{localStorage.clear()
                dispatch({type:"CLEAR"}) 
                history.push('/Signup')}}>Logout</button>
                </li>
            ]
        }else{
            return[
                <li key="6" className="nav-item">
                <Link className="nav-link" to="/Signup">Signup</Link>
                </li>,
                <li key="7" className="nav-item">
                <Link className="nav-link" to="/Login">Login</Link>
                </li>
            ]
        }
    }
    return (
        <>
            <div className="container-fluid main_menu">
                    <div className="col-md-10 col-12 mx-auto">
                        <nav className="navbar navbar-expand-lg">
                            <Link className="navbar-brand " to={state?"/":"/Login"}>  INSTAGRAM </Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ml-auto">
                                    {renderList()}
                                </ul>
                            </div>
                        </nav>
                    </div>
            </div>
        

 
        </>
    )
}

export default Navbar;