/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import "antd/dist/antd.css";
// import "font-awesome/css/font-awesome.min.css";
import Header from "./Header";
import Messages from "./Messages";
import Searchbox from "./Searchbox";
import Chatlist from "./Chatlist"
import ChatCreate from "./ChatCreate"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import socket from "socket.io-client";
import { toast } from 'react-toastify';
import {
  ChatContainer,
  StyledContainer,
  ChatBox,
  NavigationBar,
} from "../styles/styles";

function ChatRoom({ username, id, userId }) {
  // States
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatroom, setChatroom] = useState(`${id}`);
  const [joinedChats, setJoinedChats] = useState([]);
  const [chatName, setChatName] = useState("");
  const [currentChatUsers, setCurrentChatUsers] = useState([]);
  const [currentChatName, setCurrentChatName] = useState("");
  
  const activeUser = localStorage.getItem("active_user");

  // Socket
  const io = socket(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}`);
  let welcome;

  // Effects
  useEffect(() => {

    io.on("disconnect", () => {
      location.reload();
      toast.error('Disconnected from server. Refreshing the page the page.');
    });

    io.emit("join", { username, chatroom, userId, activeUser }, (error) => {
      if (error) return alert(error);
    });

    io.on("welcome", async (data, error) => {
      let welcomeMessage = {
        user: data.user,
        message: data.text,
      };
      welcome = welcomeMessage;
      setMessages([welcomeMessage]);

    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/chatrooms/${chatroom}?populate=messages,active_users`)
      .then(async (res) => {
        const response = await res.json();
        let messagesArr = [welcome];
        let usersArr = [];

        // Get the chats messages
        response.data.attributes.messages.data.forEach((message) => {
          messagesArr = [...messagesArr, message.attributes];
        });
        // Get the chats users
        response.data.attributes.active_users.data.forEach((user) => {
          usersArr = [...usersArr, user.attributes];
        });

        setCurrentChatName(response.data.attributes.chat_name);
        setMessages((msgs) => messagesArr);
        setCurrentChatUsers((users) => usersArr);
      })
      .catch((e) => console.log(e.message));

      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/active-users/${activeUser}?populate=chatrooms`)
        .then(async (res) => {
          const response = await res.json();
      
          let arr = response.data.attributes.chatrooms.data.map((chatroom) => chatroom);
          setJoinedChats(arr);
        })
        .catch((e) => console.log(e.message));
    });

    io.on("roomData", async (data) => {
      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/chatrooms/${chatroom}?populate=active_users`).then(async (e) => {
        const response = await e.json();
        let usersArr = [];

        response.data.attributes.active_users.data.forEach((user) => {
          usersArr = [...usersArr, user.attributes];
        });
        setCurrentChatUsers((users) => usersArr);
      }); 
    });

    io.on("message", async (data, error) => {
      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/chatrooms/${chatroom}?populate=messages`)
        .then(async (res) => {
          const response = await res.json();
          let arr = [welcome];

          if (!response.data || !response.data.attributes || !response.data.attributes.messages || !response.data.attributes.messages.data) {
            console.log("Response data or messages data is undefined:", response);
            return;
          }

          response.data.attributes.messages.data.forEach((message) => {
            arr = [...arr, message.attributes];
          });

          setMessages((msgs) => arr);
        })
        .catch((e) => console.log(e.message));
    });
  }, [username, chatroom]);

  const sendMessage = (message, chatroom) => {
    if (message) {
      let strapiData = {
        data: {
          user: username,
          message: message,
          chatroom: chatroom,
        },
      };
      io.emit("sendMessage", strapiData, (error) => {
        if (error) {
          alert(error);
          console.log(`there was an error: ${error}`);
        }
      });
      setMessage("");
    } else {
      toast.error("Message can't be empty")
    }
  };

  const handleMessageSend = () => {
    sendMessage(message, chatroom);
  };

  const handleChatCreate = async () => {
    let strapiData = {
      data: {
        chat_name: chatName,
        active_users: [{"id": activeUser}]
      },
    };
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/chatrooms`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(strapiData),
    })
      .then(async (e) => {
        const response = await e.json();
        setChatroom(response.data.id);
        toast.success(`Chatroom ${chatName} created!`);

        setChatName("");
      })
      .catch((e) => {
        console.log(e.message)
        toast.error(`An error occurred while creating the chatroom: ${e.message}`);
      });
  };

  const handleChatChange = (chatroom) => {
    setChatroom(chatroom);
  };



  return (
    <ChatContainer>

      <Header />

      <StyledContainer>

        <NavigationBar>
          <h2>Hello, {username}!</h2>        
          <ChatCreate setChatName={setChatName} handleChatCreate={handleChatCreate} chatName={chatName} />
          <Chatlist joinedChats={joinedChats} handleChatChange={handleChatChange}/>
          <Searchbox chatChange={handleChatChange} activeUser={activeUser}/>
        </NavigationBar>

        <ChatBox>
          <ChatHeader currentChatName={currentChatName} currentChatUsers={currentChatUsers} />
          <Messages messages={messages} username={username} />
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleMessageSend={handleMessageSend}
          />
        </ChatBox>

      </StyledContainer>

    </ChatContainer>
  );
}

export default ChatRoom;
