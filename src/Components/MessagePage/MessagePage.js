import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import classes from "./MessagePage.module.css";

export default function MessagePage() {
  const userName = useParams().username;
  const url = `ws://localhost:8080/websocket`;
  const server = new WebSocket(url);
  server.onopen = () => {
    console.log("Server started from react");
  };

  //useStates
  const [inputMessage, setinputMessage] = useState("");
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [connectedUserInfo, setconnectedUserInfo] = useState([]);
  const [totalConnectedUsers, settotalConnectedUsers] = useState([]);

  function receivedMessage(message) {
    setMessages((oldMsgs) => [...oldMsgs, message]);
  }

  let getCurrentTime = () => {
    return new Date().toLocaleTimeString();
  };

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      message: inputMessage,
      id: yourID,
      name: userName,
      time: getCurrentTime(),
    };
    setinputMessage("");
    //socketRef.current.emit("send_message", messageObject);
  }

  //websocket events

  server.on("set_id", (data) => {
    setYourID(data.id);
  });

  let newUserData = {
    message: `${userName} connected`,
    time: getCurrentTime(),
    name: userName,
    id: yourID,
    isOnline: true,
  };

  server.emit("new-user", newUserData);

  server.on("user-connected", (userData) => {
    setconnectedUserInfo((oldData) => [...oldData, userData]);
  });
  server.on("user-count", (array) => {
    settotalConnectedUsers([]);
    settotalConnectedUsers(array);
  });

  server.on("message", (message) => {
    receivedMessage(message);
  });
  server.on("user-disconnected", (array) => {
    settotalConnectedUsers(array);
  });

  return (
    <div className={classes.homePageWrapper}>
      <h1 className={classes.heading}>Welcome {userName}</h1>
      <div className={classes.chatScreenWrapper}>
        <div className={classes.chatLeftDivWrapper}>
          <h3>Current users</h3>
          <ul className={classes.userListWrapper}>
            {totalConnectedUsers.length > 0 &&
              totalConnectedUsers.map((item, pos) => {
                const { name } = item;
                return <li key={pos}>{name}</li>;
              })}
          </ul>
        </div>
        <div className={classes.verticleLine}></div>
        <div className={classes.chatrightDivWrapper}>
          <div className={classes.messageDivWrapper}>
            {connectedUserInfo &&
              connectedUserInfo.map((item, pos) => {
                const { id } = item.data;
                let isIdMatched = false;
                if (id === yourID) isIdMatched = true;
                return (
                  <CreateConnectedUsers
                    key={pos}
                    data={item.data}
                    idMatched={isIdMatched}
                  />
                );
              })}
            {messages.map((item, pos) => {
              const { id } = item;
              let isIdMatched = false;
              if (id === yourID) isIdMatched = true;
              return (
                <CreateMessageBox
                  key={pos}
                  data={item}
                  idMatched={isIdMatched}
                />
              );
            })}
          </div>
          <div className={classes.messageEditorDiv}>
            <input
              value={inputMessage}
              onChange={(e) => setinputMessage(e.target.value)}
              type="text"
            />
            <button
              onClick={(e) => {
                sendMessage(e);
              }}
            >
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CreateMessageBox = (props) => {
  const { name, message, time, id } = props.data;
  let isIdMatched = props.idMatched;
  return (
    <div className={classes.messageBox}>
      <p>{time}</p>
      <h4>{isIdMatched ? `You: ${message}` : `${name}: ${message}`}</h4>
    </div>
  );
};
const CreateConnectedUsers = (props) => {
  const { name, message, time, id } = props.data;
  let isIdMatched = props.idMatched;
  return (
    <div className={classes.conneceduserInfoBox}>
      <p>{time}</p>
      <h4>{isIdMatched ? `Welcome ${name}` : `${name} Joined`}</h4>
    </div>
  );
};
