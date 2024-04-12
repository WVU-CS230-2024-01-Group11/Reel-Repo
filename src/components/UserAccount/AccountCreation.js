import React, { useState } from 'react';
import { addNewAccount, fetchAccountData } from '../../services/database';
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

  const clearErrors = () => {
    setUserError('');
    setFirstError('');
    setLastError('');
    setEmailError('');
    setPasswordError('');
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

  const usernameTaken = async () => {
    try {
      const data = await fetchAccountData();
      return data.find(user => user.username === username);
    } catch (error) {
      console.error("Error fetching account data", error);
      return false;
    }
  };
  const validateInput = async() => {
    clearErrors();
    let isValid = true;

    if (username === "") {
      setUserError("Username can't be blank");
      isValid = false;
    } else if (await usernameTaken()) {
      setUserError("Username is already taken");
      isValid = false;
    }

    if (email === "") {
      setEmailError("Email can't be blank");
      isValid = false;
    } else if (!isValidEmail()) {
      setEmailError("Provide a valid email address");
      isValid = false;
    }

    if (firstName === "") {
      setFirstError("First name can't be blank");
      isValid = false;
    }

    if (lastName === "") {
      setLastError("Last name can't be blank");
      isValid = false;
    }

    if (password === "") {
      setPasswordError("Password can't be blank");
      isValid = false;
    } else if (isStrongPassword() !== "valid") {
      setPasswordError(isStrongPassword());
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (await validateInput()) {
      let newUser = { username, firstName, lastName, email, password };
        const response = await addNewAccount(newUser);
        if (response) {
          console.log("User created successfully");
          setUsername('');
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          clearErrors();
        } else {
          console.log("Failed to create user", response.error);
        }
    } else {
      console.log("Fix the errors and resubmit.");
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
