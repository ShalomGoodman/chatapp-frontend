/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'; // <-- Import useRouter hook from next/router
import { Button, Input } from "antd";
import "antd/dist/antd.css";
// import "font-awesome/css/font-awesome.min.css";
import Header from "./Header";
import Messages from "./Messages";
import Searchbox from "./Searchbox";
import List from "./List";
import socket from "socket.io-client";
import { toast } from 'react-toastify';
import {
  ChatContainer,
  StyledContainer,
  ChatBox,
  StyledButton,
  SendIcon,
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

  const router = useRouter();

  // Effects
  useEffect(() => {

    io.on("disconnect", () => {
      io.off();
      location.replace(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/`);
      console.log("disconnected");
      toast.error('Disconnected from server. Please refresh the page.');
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
        console.log("send message");
        if (error) {
          alert(error);
        }
      });
      setMessage("");
    } else {
      alert("Message can't be empty");
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
      <Header room={currentChatName} />  
      <StyledContainer>
        <div>
          <h2>Hello, {username}</h2>
          <h3>Members of room: {currentChatName}</h3>
          <ul>
            {currentChatUsers.map((user, index) => (
              <li key={index}>{user.users}</li>
            ))}
          </ul>
          <h3>Create a Chat</h3>
          <input onChange={(e) => setChatName(e.target.value)} type="text" placeholder="Make a chat name" />
          <Button onClick={handleChatCreate}>Create Chat</Button>
          <h3>Joined Chats</h3>
            {joinedChats.map((chat) => (
              <button onClick={() => handleChatChange(chat.id)} key={chat.id}>{chat.attributes.chat_name}</button>
            ))}
          <h3>Join a Chat</h3>
              <Searchbox chatChange={handleChatChange} activeUser={activeUser}/>
        </div>

        <ChatBox>
          
          <Messages messages={messages} username={username} />
          <Input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault(); // Prevent a newline character or other default action
                handleMessageSend();
              }
            }}
          />
          <StyledButton onClick={handleMessageSend}>
            <SendIcon>
              <i className="fa fa-paper-plane" />
            </SendIcon>
          </StyledButton>
          
        </ChatBox>

      </StyledContainer>
    </ChatContainer>
  );
}

export default ChatRoom;
