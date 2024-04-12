import {addNewAccount, fetchAccountData, fetchUsernames} from '../../services/database';
import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import  { UsernameContext } from '../Contexts/UsernameContext';
import ReCAPTCHA from "react-google-recaptcha";
//6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC
function AccountCreation() {
  const navigate = useNavigate();
  const {username, setUsername}=useContext(UsernameContext);
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

  const isValidEmail = () => {
    const format = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return format.test(email.toLowerCase());
  };

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
    const isTaken=await usernameTaken();
    if (username === "") {
      setUserError("Username can't be blank");
      return false;
    } else if (isTaken){
      setUserError("Username is already taken");
      return false;
    }

    if (email === "") {
      setEmailError("Email can't be blank");
      return false;
    } else if (!isValidEmail()) {
      setEmailError("Provide a valid email address");
      return false;
    }

    if (firstName === "") {
      setFirstError("First name can't be blank");
      return false;
    }

    if (lastName === "") {
      setLastError("Last name can't be blank");
      return false;
    }

    if (password === "") {
      setPasswordError("Password can't be blank");
      return false;
    } else if (isStrongPassword!=="valid") {
      setPasswordError(isStrongPassword);
      return false;
    }
    if (passwordMatch === "") {
      setPasswordMatchError("Please confirm your password");
      return false;
    } else if (passwordMatch !== password) {
      setPasswordMatchError("Passwords do not match");
      return false;
    }
  };

  //Makes sure only validated user data is added to db
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    clearErrors();
    const isValid=validateInput();
    if(!isValid){
      console.log("inputs not valid");
      return;
    }
    //Adding new user
    console.log("adding user");
    let newUser={username, firstName, lastName, email, password};
    const response= await addNewAccount(newUser);
    navigate("/");
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit" disabled={!capVal}>Submit</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default AccountCreation