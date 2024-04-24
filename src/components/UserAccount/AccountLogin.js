import React, { useState,useContext } from 'react';
import { useUsername } from '../Contexts/UsernameContext';
import { fetchAccountData } from '../../services/database';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
//6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC
function AccountLogin(){
  const { username, setUsername } = useUsername();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [capVal, setCapVal]=useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    let valid = false;
    setUserError("");
    setPasswordError("");
  //Ensures all inputs are valid before adding new user
    try {
      const users= await fetchAccountData();
      const foundUser= users.find((user)=> user.username===username)
      if (foundUser){
        if (foundUser.password===password){
          navigate("/home"); 
        }
        else{
          setPasswordError("Incorrect password");
        }
      }
      else{
        setUserError("Username not found");
      }
      console.log(foundUser);
    }
    catch(error){

    }
  }

  return (
    <div className="App" style={{fontFamily: "arial"}}>
      <div style={{marginTop: "50px"}}><h1 style={{fontSize: "50pt"}}>Reel Repo</h1></div>
      <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-70%)"}}>
        <form id="form" onSubmit={handleSubmit}>
          <h2 style={{margin: "50px", fontSize: "26pt"}} >Account Login</h2>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content"}}>
            <label htmlFor="user">Username</label>
            <input
              type="text"
              name="user"
              id="user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div id="userError">{userError}</div>
          </div>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content"}}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div id="passwordError">{passwordError}</div>
          </div>
          <ReCAPTCHA style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content"}}
          sitekey="6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC"
          onChange={(val)=>setCapVal(val)} 
          />
          <button style={{display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content"}} type="submit" disabled={!capVal}>Submit</button>
        </form>
      </div>
    </div>
  );
}
export default AccountLogin;
