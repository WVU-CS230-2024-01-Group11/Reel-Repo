import { addNewAccount, fetchAccountData } from '../../services/database';
import React, { useState } from 'react';
import './AccountCreation.css';
function AccountCreation() {

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState('');
  const [firstError, setFirstError] = useState('');
  const [lastError, setLastError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  //Clears error messages
  const clearErrors = () => {
    setUserError('');
    setFirstError('');
    setLastError('');
    setEmailError('');
    setPasswordError('');
  };

  //checks if email format is valid 
  const isValidEmail = () => {
    //Email regex, seems to cover all cases 
    const format = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return format.test(email.toLowerCase());
  };

  //checks for password strength, returns specific message to weakness 
  const isStrongPassword = () => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*()~`?/;:'"<>]/.test(password);
    const length = password.length;
    let message="";

    if (hasUpper && hasLower && hasSpecial && length >= 8) {
      message="valid"
      return message;
    } else {
      if (!hasLower) {
        message+="Password must have a lowercase letter\n";
      }
      if (!hasUpper) {
        message+="Password must have an uppercase letter\n";
      }
      if (!hasSpecial) {
        message+="Password must have at least one special character\n";
      }
      if (length < 8) {
        message+="Password must be at least 8 characters long";
      }
      return message;
    }
  };
  //Checks username availability 
  const usernameTaken = () => {
   // const data= fetchAccountData();
    //return data.find(user => user.username === username);;
  }

  //Checks inputs
  const validateInput = () => {
    clearErrors();
    if (username === "") {
      setUserError("Username can't be blank");
    } else if (!usernameTaken()){
      setUserError("Username is already taken");
    }
    if (email === "") {
      setEmailError("Email can't be blank");
    } else if (!isValidEmail()) {
      setEmailError("Provide a valid email address");
    }
    if (firstName === "") {
      setFirstError("First name can't be blank");
    }
    if (lastName === "") {
      setLastError("Last name can't be blank");
    }
    if (password === "") {
      setPasswordError("Password can't be blank");
    } else if (isStrongPassword!="valid") {
      setPasswordError(isStrongPassword);
    }
  };

  //Makes sure only validated user data is added to db
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    let valid = false;
  //Ensures all inputs are valid before adding new user
  do {
    console.log("Form submitted");
    validateInput();
    valid = !(userError || firstError || lastError || emailError || passwordError);
    if (!valid) {
      console.log("Fix the errors and resubmit.");
    }
  } while (!valid);
  //Adding new user
  let newUser={username, firstName, lastName, email, password};
  try {
    const response= addNewAccount(newUser);
    if (response.success) {
      console.log("User created success");
      setUsername('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      clearErrors();
    } else {
      console.log("Failed to create user", response.error);
    }
  } catch (error) {
    console.error("Error adding new user", error);
  }
  };
  

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
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
    </div>
    
  );
}

export default AccountCreation;