import {addNewAccount, fetchAccountData, fetchUsernames} from '../../services/database';
import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import  { useUsername } from '../Contexts/UsernameContext';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
//Abstract API 
const apiKey = '8ae6693aed28402592266ed6eed9a016';
const apiURL = 'https://emailvalidation.abstractapi.com/v1/'+apiKey;
//6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC   Captcha key
function AccountCreation() {
  const navigate = useNavigate();
  const { username, setUsername } = useUsername();
  const [tempUsername,setTempUsername]=useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMatch, setPasswordMatch]= useState('');
  const [userError, setUserError] = useState('');
  const [firstError, setFirstError] = useState('');
  const [lastError, setLastError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [capVal, setCapVal]=useState(null);

  //Clears error messages
  const clearErrors = () => {
    setUserError('');
    setFirstError('');
    setLastError('');
    setEmailError('');
    setPasswordError('');
    setPasswordMatchError('');
  };

  const isValidEmail = async () => {
    const format = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validFormat=format.test(email.toLowerCase());
    const validEmail=await sendEmailValidationRequest();
    if (!validFormat){
      return 1;
    }
    if (!validEmail){
      return 2;
    }
    return 0;
  };
  const sendEmailValidationRequest = async () => {
    if (email===''){
      return false;
    }
    try {
      const response = await axios.get(`https://emailvalidation.abstractapi.com/v1?api_key=8ae6693aed28402592266ed6eed9a016&email=${email}`);
      console.log (response.data.is_disposable_email.value);
      return response.data.is_disposable_email.value;
  } catch (error) {
      if (error.response && error.response.status === 429) {
          //standard plan is 1 request a second
          await new Promise(resolve => setTimeout(resolve, 2000)); 
          return sendEmailValidationRequest(); 
      } else {
          throw error; 
      }
  }
  }
  const isStrongPassword = () => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*()~`?/;:'"<>]/.test(password);
    const length = password.length;
    let message = "";

    if (hasUpper && hasLower && hasSpecial && length >= 8) {
      return "valid";
    } else {
      if (!hasLower) {
        message += "Password must have a lowercase letter\n";
      }
      if (!hasUpper) {
        message += "Password must have an uppercase letter\n";
      }
      if (!hasSpecial) {
        message += "Password must have at least one special character\n";
      }
      if (length < 8) {
        message += "Password must be at least 8 characters long";
      }
      return message;
    }
  };
  
  //Checks if username is already in db
  const usernameTaken = async () => {
    console.log("fetching usernames");
    const users= await fetchUsernames();
    console.log("looking for usernames");
    const foundUser= users.find((user)=> user.username===username)
      if (foundUser){
        if (foundUser.password===password){
          return true;
        }
        else{
          console.log("username taken");
          return false;
        }
      }
  }

  //Checks inputs
  const validateInput = async() => {
    clearErrors();
    let passedAll=true
    const isTaken=await usernameTaken();
    if (tempUsername === "") {
      setUserError("Username can't be blank");
      passedAll=false;
    } else if (isTaken){
      setUserError("Username is already taken");
      passedAll=false;
    }
    console.log("checking emails");
    if (email === "") {
      setEmailError("Email can't be blank");
      passedAll=false;
    } 
    console.log("checking if valid email");
    const emailValidationResult = await isValidEmail();
    if (emailValidationResult===1) {
      console.log("format wrong");
      setEmailError("Provide a valid email format");
      passedAll=false;
    } else if (emailValidationResult===2){
      console.log("email error set");
      setEmailError("Provide a valid email");
      passedAll=false; 
    }

    if (firstName === "") {
      setFirstError("First name can't be blank");
      passedAll=false;
    }

    if (lastName === "") {
      setLastError("Last name can't be blank");
      passedAll=false;
    }

    if (password === "") {
      setPasswordError("Password can't be blank");
      passedAll=false;
    } else if (isStrongPassword!=="valid") {
      setPasswordError(isStrongPassword);
      passedAll=false;
    }
    if (passwordMatch === "") {
      setPasswordMatchError("Please confirm your password");
      passedAll=false;
    } else if (passwordMatch !== password) {
      setPasswordMatchError("Passwords do not match");
      passedAll=false;
    }
    return passedAll;
  };

  //Makes sure only validated user data is added to db
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    clearErrors();
    const isValid=await validateInput();
    if(!isValid){
      console.log("inputs not valid");
      return;
    }
    //Adding new user
    console.log("adding user");
    let newUser={tempUsername, firstName, lastName, email, password};
    const response= await addNewAccount(newUser);
    setUsername(tempUsername);
    navigate("/home");
  } 

  return (
    <div className='content'>
      <div className="App">
      <div>
        <form id="form" onSubmit={handleSubmit}>
          <h1>Account Creation</h1>
          <div>
            <label htmlFor="first">First Name</label>
            <input
              type="text"
              name="first"
              id="first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <div id="firstError">{firstError}</div>
          </div>
          <div>
            <label htmlFor="last">Last Name</label>
            <input
              type="text"
              name="last"
              id="last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <div id="lastError">{lastError}</div>
          </div>
          <div>
            <label htmlFor="user">Username</label>
            <input
              type="text"
              name="user"
              id="user"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
            />
            <div id="userError">{userError}</div>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div id="emailError">{emailError}</div>
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
          <div>
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              name="passwordMatch"
              id="passwordMatch"
              value={passwordMatch}
              onChange={(e) => setPasswordMatch(e.target.value)}
            />
            <div id="passwordMatchError">{passwordMatchError}</div>
          </div>
          <ReCAPTCHA
          sitekey="6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC"
          onChange={(val)=>setCapVal(val)} 
          />
          <button type="submit" disabled={capVal}>Submit</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default AccountCreation