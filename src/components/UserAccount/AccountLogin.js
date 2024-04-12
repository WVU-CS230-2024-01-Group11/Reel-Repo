import React, { useState,useContext } from 'react';
import { UsernameContext } from '../Contexts/UsernameContext';
import { fetchAccountData } from '../../services/database';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
//6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC
function AccountLogin(){
  const {username,setUsername}=useContext(UsernameContext);
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
          navigate("/"); 
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
    <div className="App">
      <div>
        <form id="form" onSubmit={handleSubmit}>
          <h1>Account Login</h1>
          <div>
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
          <div>
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
          <ReCAPTCHA
          sitekey="6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC"
          onChange={(val)=>setCapVal(val)} 
          />
          <button type="submit" disabled={!capVal}>Submit</button>
        </form>
      </div>
    </div>
  );
}
export default AccountLogin;
