import React, { useState, useCallback} from 'react';
import { useUsername } from '../Contexts/UsernameContext';
import { fetchAccountData } from '../../services/database';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import logo from "../NavigationBar/logo.png"

//6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC
function AccountLogin(props){
  const { username, setUsername } = useUsername();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [capVal, setCapVal]=useState(null);
  
  const particlesInit = useCallback(async engine => {
    console.log(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
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
    <div className="App" style={{fontFamily: "arial", color: "white"}}>
      <div style={{marginTop: "50px"}}><h1 style={{fontSize: "50pt"}}><img src={logo} style={{width:"100px"}}/>Reel Repo</h1></div>
        <form id="form" onSubmit={handleSubmit}>
        <h2 style={{marginTop: "50px", marginBottom: "25px"}}>Login</h2>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
            <label htmlFor="user" style={{marginRight: "10px"}}>Username:</label>
            <input
              type="text"
              name="user"
              id="user"
              value={username}
              style={{borderRadius: "10px", border: "none"}}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div id="userError" style={{marginLeft: "auto", marginRight: "auto", width: "fit-content", whiteSpace: "nowrap"}}>{userError}</div>
          </div>
          <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
            <label htmlFor="password" style={{marginRight: "10px"}}>Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              style={{borderRadius: "10px", border: "none"}}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div id="passwordError" style={{marginLeft: "auto", marginRight: "auto", width: "fit-content", whiteSpace: "nowrap"}}>{passwordError}</div>
          </div>
          <ReCAPTCHA style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content"}}
          sitekey="6Lc3SrkpAAAAAMwwC84Vcu_qXSQS7WFrmpLb-pPC"
          onChange={(val)=>setCapVal(val)} 
          />
          <button style={{display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", borderRadius: "15px", border: "none", boxShadow: ""}} type="submit" disabled={!capVal}>Submit</button>
        </form>
        <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "15px", width: "fit-content", whiteSpace: "nowrap"}}>
          New user? <Link to="/account-creation">Create Account</Link>
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
      </div>
  );
}
export default AccountLogin;
