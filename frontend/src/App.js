import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { BrowserRouter , Route, Switch, useHistory } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Createpost from './components/screens/Createpost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUser from './components/screens/SubscribedUser';
import {reducer,initialState} from './reducers/userreducer';

export const UserContext= createContext()

const Routing=()=>{
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("users"))
    if(user){
      dispatch({type:"USER",payload:user})  //to save the tokens so that if user havent logout he can see his profile
    }
    else{
      history.push('/Login');
    }
    console.log("hello");
  },[])
  return(
    <Switch>
    <Route exact path='/'><Home/></Route>
    <Route exact path='/Profile'><Profile/></Route>
    <Route exact path='/Login'><Login/></Route>
    <Route exact path='/Signup'><Signup/></Route>
    <Route exact path='/Createpost'><Createpost/></Route>
    <Route exact path='/Profile/:userid'><UserProfile/></Route>
    <Route exact path='/myfollowings'><SubscribedUser/></Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <>
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter key="brower">
      <Navbar/>
      <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
    </>
  );
}

export default App;
