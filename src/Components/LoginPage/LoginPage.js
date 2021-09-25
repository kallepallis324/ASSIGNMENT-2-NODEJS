import React, { useState } from "react";
import classes from "./LoginPage.module.css";
import { useHistory } from "react-router-dom";

export default function LoginPage() {
  const [inputText, setinputText] = useState("");
  const [inputKey, setinputKey] = useState("");
  const [isError, setisError] = useState(false);
  const history = useHistory();

  const handleSubmit = (input) => {
    if (input.toString().trim().length > 3 && inputKey === "1234") {
      setisError(false);
      history.push(`/join/${input}`);
    } else {
      setisError(true);
    }
  };

  return (
    <div className={classes.LoginPageWrapper}>
      <h1>Join to chat app</h1>
      <div className={classes.loginFormWrapper}>
        <p>Username</p>
        <div className={classes.loginFormInputsWrapper}>
          <input
            value={inputText}
            onChange={(e) => setinputText(e.target.value)}
            type="text"
            placeholder="Enter username"
          />
          <button
            onClick={() => {
              handleSubmit(inputText);
            }}
          >
            Join
          </button>
        </div>
        <div className={classes.loginFormInputsWrapper}>
          <input
            type="text"
            placeholder="Enter key eg. 1234"
            value={inputKey}
            onChange={(e) => {
              setinputKey(e.target.value);
            }}
          />
        </div>

        {isError ? (
          <div className={classes.loginPageErrorWrapper}>
            <p>Please enter valid data</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
