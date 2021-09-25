import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import classes from "./HomePage.module.css";
import io from "socket.io-client";
import { addDataToStorage } from "../../Handle Storage/saveUsersToStorage";

export default function HomePage() {
  const userName = useParams().username;
  const itemName = "users";
  let connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  //useStates
  const [inputMessage, setinputMessage] = useState("");
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [connectedUserInfo, setconnectedUserInfo] = useState([]);
  const [totalConnectedUsers, settotalConnectedUsers] = useState([]);
  const [disconnectedUsers, setdisconnectedUsers] = useState([]);
  const [messageBoxClass, setmessageBoxClass] = useState([classes.messageBox]);

  let totalUsers = window.localStorage.getItem(itemName);
  if (totalUsers !== null || totalUsers !== "") {
    //settotalConnectedUsers();
    totalUsers = JSON.parse(totalUsers);
    //console.log(JSON.parse(totalUsers));
  }

  //console.log(totalUsers);

  const socketRef = useRef();
  let connectionUrl = "https://chat-app-backend-socket.herokuapp.com/";

  useEffect(() => {
    socketRef.current = io.connect(connectionUrl, {
      transports: ["websocket"],
    });

    socketRef.current.on("set_id", (data) => {
      setYourID(data.id);
    });

    let newUserData = {
      message: `${userName} connected`,
      time: getCurrentTime(),
      name: userName,
      id: yourID,
      isOnline: true,
    };

    socketRef.current.emit("new-user", newUserData);

    socketRef.current.on("user-connected", (userData) => {
      setconnectedUserInfo((oldData) => [...oldData, userData]);
    });
    socketRef.current.on("show-disconnect", (userData) => {
      setdisconnectedUsers([userData]);
    });
    socketRef.current.on("user-count", (array) => {
      settotalConnectedUsers([]);
      settotalConnectedUsers(array);
    });

    socketRef.current.on("message", (message) => {
      receivedMessage(message);
    });
    socketRef.current.on("user-disconnected", (array) => {
      settotalConnectedUsers(array);
    });
  }, []);

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
    if (inputMessage.trim().length !== 0) {
      socketRef.current.emit("send_message", messageObject);
    }
  }

  const CreateMessageBox = (props) => {
    const { name, message, time, id } = props.data;
    let isIdMatched = props.idMatched;
    let className = [classes.messageBox];
    let classNameMessageName = [classes.messageBoxNameWrapper];
    if (isIdMatched) {
      className = [classes.messageBoxOther];
      classNameMessageName = [classes.messageBoxNameWrapperOther];
    }
    return (
      <div className={classes.messageBoxWrapper}>
        <div className={className}>
          <div className={classNameMessageName}>
            <h4>{isIdMatched ? `You` : `${name}`}</h4>
            <p>{time}</p>
          </div>
          <h3>{message}</h3>
        </div>
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
  const CreateDisconnectedUsers = (props) => {
    const { name, time } = props.data;
    return (
      <div className={classes.disconneceduserInfoBox}>
        <p>{time}</p>
        <h4>{`${name} disconnected`}</h4>
      </div>
    );
  };

  return (
    <div className={classes.homePageWrapper}>
      <div className={classes.chatScreenWrapper}>
        <div className={classes.chatLeftDivWrapper}>
          <h3>Current users</h3>
          <ul className={classes.userListWrapper}>
            {/* {connectedUserInfo.length > 0 &&
              connectedUserInfo[connectedUserInfo.length - 1].usersList.map(
                (item, pos) => {
                  const { name } = item;
                  return <li key={pos}>{name}</li>;
                }
              )} */}
            {totalConnectedUsers.length > 0 &&
              totalConnectedUsers.map((item, pos) => {
                const { name } = item;
                return <li key={pos}>{name}</li>;
              })}
          </ul>
        </div>
        <div className={classes.verticleLine}></div>
        <div className={classes.chatrightDivWrapper}>
          <div className={classes.chatrightTopbar}>
            <h2>{`${userName}`}</h2>
          </div>
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
            {disconnectedUsers.map((item) => {
              return <CreateDisconnectedUsers data={item} />;
            })}
          </div>
          <div className={classes.messageEditorDiv}>
            <input
              value={inputMessage}
              onChange={(e) => setinputMessage(e.target.value)}
              type="text"
              placeholder="write a message"
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
