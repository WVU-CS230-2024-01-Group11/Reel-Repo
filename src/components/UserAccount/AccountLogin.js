import { fetchAccountData } from '../../services/database';
import React, { useState,useContext } from 'react';
import { UsernameContext } from '../../App';

function AccountLogin(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {setUser} = useContext(UsernameContext);


  const validateInfo = () => {
    //const data= fetchAccountData();
   // return data.find(user => user.username === username);;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    let valid = false;
  //Ensures all inputs are valid before adding new user
  do {
    console.log("Form submitted");
    //validateInfo();
    valid = !(userError || passwordError);
    if (!valid) {
      console.log("Fix the errors and resubmit.");
    }
  } while (!valid);
    setUser(username);

  };
  


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
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
  }
export default AccountLogin;
