import {addNewAccount, fetchUsernames} from '../../services/database';
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import  { useUsername } from '../Contexts/UsernameContext';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

//Abstract API 
const apiKey = '8ae6693aed28402592266ed6eed9a016';
const apiURL = 'https://emailvalidation.abstractapi.com/v1/'+apiKey;

//6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC   Captcha key
function AccountCreation(props) {
  const particlesInit = useCallback(async engine => {
    console.log(engine);
    await loadSlim(engine);
  }, []);
  
  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

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
    console.log(validEmail);
    console.log(validFormat);
    if (!validFormat){
      return 1;
    }
    if (validEmail){
      return 2;
    }
    return 0;
  };


  const sendEmailValidationRequest = async () => {
    if (email===''){
      return true;
    }
    try {
      //const response = await axios.get(`https://emailvalidation.abstractapi.com/v1?api_key=8ae6693aed28402592266ed6eed9a016&email=${email}`);
      //console.log (response.data.is_disposable_email.value);
      //return response.data.is_disposable_email.value;
      return false;
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
      return true;
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
    const users= await fetchUsernames();
    
    const foundUser= users.find((user)=> user.username===tempUsername);
    console.log(tempUsername);
    console.log(foundUser);
      if (foundUser){
        if (foundUser.password===password){
          return true;
        }
        else{
          console.log("username taken");
          return false;
        }
      }

      else {
        return false;
      }
  }

  //Checks inputs
  const validateInput = async() => {
    clearErrors();
    let passedAll=true
    const isTaken=await usernameTaken();
    console.log(isTaken);
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
    const emailValidationResult = await isValidEmail();
    console.log(emailValidationResult);
    if (emailValidationResult===1) {
      setEmailError("Provide a valid email format");
      passedAll=false;
    } else if (emailValidationResult===2){
      console.log("email error set");
      setEmailError("Provide a valid email");
      passedAll=false; 
    }
    console.log(`email validation: ${passedAll}`);
    if (firstName === "") {
      setFirstError("First name can't be blank");
      passedAll=false;
    }
    console.log(`firstname: ${passedAll}`);
    if (lastName === "") {
      setLastError("Last name can't be blank");
      passedAll=false;
    }
    console.log(`lastname: ${passedAll}`);
    if (password === "") {
      setPasswordError("Password can't be blank");
      passedAll=false;
    } else if (!isStrongPassword) {
      setPasswordError(isStrongPassword);
      passedAll=false;
    }
    console.log(`password strong/blank: ${passedAll}`);
    if (passwordMatch === "") {
      setPasswordMatchError("Please confirm your password");
      passedAll=false;
      console.log(`password match blank: ${passedAll}`);
    } else if (passwordMatch !== password) {
      setPasswordMatchError("Passwords do not match");
      passedAll=false;
      console.log(`[password not matched: ${passedAll}`);
    }
    return passedAll;
  };

  //Makes sure only validated user data is added to db
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    clearErrors();
    const isValid=await validateInput();
    console.log(isValid);
    if(!isValid){
      console.log("inputs not valid");
      return;
    }
    //Adding new user
    console.log("adding user");
    const character_icon = "defaultAvatar";
    let newUser={tempUsername, firstName, lastName, email, password, character_icon};
    setUsername(tempUsername);
    addNewAccount(newUser);
  
    navigate("/home");
  } 

  return (
    <>
      <div className="App" style={{fontFamily: "arial", color: "white"}}>
      <div style={{marginTop: "50px"}}><h1 style={{fontSize: "50pt"}}>Reel Repo</h1></div>
        <form id="form" onSubmit={handleSubmit}>
          <h2 style={{marginTop: "50px", marginBottom: "25px"}}>Account Creation</h2>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
            <label htmlFor="first" style={{marginRight: "10px"}}>First Name:</label>
            <input
              type="text"
              name="first"
              id="first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{borderRadius: "10px", border: "none"}}
            />
            <div id="firstError" style={{marginLeft: "auto", marginRight: "auto", width: "fit-content", whiteSpace: "nowrap"}}>{firstError} </div>
          </div>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
            <label htmlFor="last" style={{marginRight: "10px"}}>Last Name:</label>
            <input
              type="text"
              name="last"
              id="last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{borderRadius: "10px", border: "none"}}
            />
            <div id="lastError" style={{marginLeft: "auto", marginRight: "auto", width: "fit-content", whiteSpace: "nowrap"}}>{lastError}</div>
          </div>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
            <label htmlFor="user" style={{marginRight: "10px"}}>Username:</label>
            <input
              type="text"
              name="user"
              id="user"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              style={{borderRadius: "10px", border: "none"}}
            />
            <div id="userError" style={{marginLeft: "auto", marginRight: "auto", width: "fit-content", whiteSpace: "nowrap"}}>{userError}</div>
          </div>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
            <label htmlFor="email" style={{marginRight: "10px"}}>Email: </label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{borderRadius: "10px", border: "none"}}
            />
            <div id="emailError" style={{marginLeft: "auto", marginRight: "auto", width: "fit-content", whiteSpace: "nowrap"}}>{emailError}</div>
          </div>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
            <label htmlFor="password" style={{marginRight: "10px"}}>Password: </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{borderRadius: "10px", border: "none"}}
            />
            <div id="passwordError" style={{marginLeft: "auto", marginRight: "auto", width: "fit-content", whiteSpace: "nowrap"}}>{passwordError}</div>
          </div>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
            <label htmlFor="password" style={{marginRight: "10px"}}>Confirm Password: </label>
            <input
              type="password"
              name="passwordMatch"
              id="passwordMatch"
              value={passwordMatch}
              onChange={(e) => setPasswordMatch(e.target.value)}
              style={{borderRadius: "10px", border: "none"}}
            />
            <div id="passwordMatchError" style={{marginLeft: "auto", marginRight: "auto", width: "fit-content", whiteSpace: "nowrap"}}>{passwordMatchError}</div>
          </div>
          <ReCAPTCHA style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}
          sitekey="6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC"
          onChange={(val)=>setCapVal(val)} 
          />
          <button type="submit" disabled={!capVal} style={{display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", borderRadius: "15px", border: "none", boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)"}}>Submit</button>
        </form>
        <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
      <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fullScreen: {
                    enable: true,
                    zIndex: -1
                },
                background: {
                    color: {
                        value: props.primary,
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: props.secondary,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 8,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 2000,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 1,
                    },
                    shape: {
                        type: "square",
                    },
                    size: {
                        value: { min: 10, max: 20 },
                    },
                },
                detectRetina: true,
            }}
          />
    </>
  );
}

export default AccountCreation