import PDFUploader from './PDFUploader';
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./style.css";

function App() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNoteVisible, setIsNoteVisible] = useState(true);
  const [isSecondNoteVisible , setSecondNoteVisible] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fileDetails , setFileDetails] = useState(true);
  const [isLoggedOut , setLoggedOut]  = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSubmitted(false);
    setIsNoteVisible(true);
    setSecondNoteVisible(false);
    setErrorMessages({});
    setLoggedOut(false)
  };


  // User Login info
  const database = [
    {
      username: "admin",
      password: "1111"
    }
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmit = (event) => {
    // Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
        setIsLoggedIn(true);
        setIsNoteVisible(false);
        setFileDetails(true);
        setSecondNoteVisible(true);
        setLoggedOut(true) // Update the state here
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <div className="title">Sign In</div>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );


  return (
    <div className="app">
      <h1 className="Introstart">PUT IT IN THE BOX</h1>
      {isNoteVisible && (
        <h3 className="Intro">
          WOHNGELDABRECHNUNG lists all the costs that have to be borne by the homeowners’ association. WOHNGELDABRECHNUNG contains all income and expenses that have flowed, as well as the development of the maintenance reserve. This allows the apartment owners to derive how high their current assets are and what payments they may be in arrears with.
        </h3>
      )}
      {isSecondNoteVisible && (<h3 className="Intros">
      Here you can extract tax and bank details from your WOHNGELDABRECHNUNG .
 All you need to do is to click on the choose file button below and upload your file ( pdf format) 
  and click on the Upload button amd tada! Your file is extracted! Now just click on the Extract Bank details or
   Extract Tax Details to extract your details respectively.

    
        </h3>
        )}
      <div className="login-form">
        {isSubmitted ? (
          <PDFUploader 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn = {setIsLoggedIn} 
            renderForm={renderForm} 
            setFileDetails={setFileDetails} 
            setLoggedOut={setLoggedOut}
            isLoggedOut={isLoggedOut}
            fileDetails={fileDetails} 
            handleLogout={handleLogout}/>
        ) : (
          renderForm
        )}

      </div>
      
      {isLoggedOut && (  
          <button className="Button" onClick={handleLogout}>Logout</button> )}
    </div>
  );
}

export default App;
