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
  const [Input, setInput] = useState("");
  const [chatGptMessages, setChatGptMessages] = useState([]);
  
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

  const remountChatList = () => {
    io.emit("roomData");
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/active-users/${activeUser}?populate=chatrooms`)
      .then(async (res) => {
        const response = await res.json();
  
        let arr = response.data.attributes.chatrooms.data.map((chatroom) => chatroom);
        setJoinedChats(arr);
      })
      .catch((e) => console.log(e.message));
  }

  const handleMessageSend = () => {
    sendMessage(message, chatroom);
  };

  const handleChatCreate = async () => {
    let strapiData = {
      data: {
        chat_name: chatName,
        active_users: [{"id": activeUser}],
        admin: username,
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

  const handleChatLeave = async (chatroomId) => {
    const confirm = window.confirm(`Are you sure you want to leave this chatroom?`);
    if (confirm) {
    try {
      const updatedActiveUserData = {
        data: {
          chatrooms: {
            disconnect: [{ id: chatroomId }]
          }
        }
      };
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/active-users/${activeUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedActiveUserData),
      });
  
      if (res.ok) {
        toast.success(`Successfully left chatroom`);
        remountChatList(); // Remount the Chatlist component
      } else {
        const response = await res.json();
        toast.error(`Failed to leave chatroom: ${response.message}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error(`An error occurred while leaving the chatroom: ${error.message}`);
    }
  } else {
    return;
  }
  };
  
  const handleChatDelete = async (chatroomId) => {
    if (confirm(`Are you sure you want to delete this chat?`)) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/chatrooms/${chatroomId}`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          },
        });
        if (res.ok) {
          toast.success(`Chatroom was deleted!`);
          remountChatList(); // Remount the Chatlist component
        } else {
          const response = await res.json();
          toast.error(`Failed to delete chatroom: ${response.message}`);
        }
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error(`An error occurred while deleting the chatroom: ${error.message}`);
      }
    }
  };

  let chatProps = {};

if (currentChatName === 'chatgpt') {
  chatProps = {
    messages: chatGptMessages,
    username: username,
    message: Input,
    setMessage: setInput,
    handleMessageSend: onSubmit
  };
} else {
  chatProps = {
    messages: messages,
    username: username,
    message: message,
    setMessage: setMessage,
    handleMessageSend: handleMessageSend
  };
}

async function onSubmit(event) {

  try {
      setInput("");
      console.log("Input:", Input);
      console.log("Messages:", chatGptMessages);
      console.log("Username:", username, "Type:", typeof username);
      setChatGptMessages(prevMessages => [...prevMessages, { user: username, message: Input, createdAt: Date.now()}]);

      const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: Input, context: chatGptMessages, username: username}),
      })

      if (!response.ok) {
          const text = await response.text();
          console.error('Server error:', text);
          throw new Error(`Server error: ${text}`);
      }

      const data = await response.json();
      // Append AI message to messages array
      setChatGptMessages(prevMessages => [...prevMessages, { user: 'Dino', message: data.result, createdAt: Date.now()}]);


      
  } catch (error) {
      console.error(error);
      alert(error.message);
  }
}
  




  return (
    <ChatContainer>

      <Header />

      <StyledContainer>

        <NavigationBar>
          <h2>Hello, {username}!</h2>   
          <Chatlist
            joinedChats={joinedChats}
            handleChatChange={handleChatChange}
            deleteChat={handleChatDelete}
            leaveFromChat={handleChatLeave}
            username={username}
            />     
          <ChatCreate setChatName={setChatName} handleChatCreate={handleChatCreate} chatName={chatName} />
          <Searchbox chatChange={handleChatChange} activeUser={activeUser}/>
          <Button 
            onClick={() => {
              handleChatChange(46)
              toast.info(`You are now chatting with Dino! This is an Experimental feature, please keep in mind that the AI may be inaccurate or incorrect.`);
              setChatGptMessages(prevMessages => [...prevMessages, { user: 'Dino', message: "Hello, my name is Dino, your AI friend", createdAt: Date.now()}]);
            }}
            color="purple"
            >✨ Chat with Dino! 🦖</Button>
        </NavigationBar>

        <ChatBox>
          <ChatHeader currentChatName={currentChatName} currentChatUsers={currentChatUsers} />
              <Messages messages={chatProps.messages} username={username} />
              <MessageInput
                message={chatProps.message}
                setMessage={chatProps.setMessage}
                handleMessageSend={chatProps.handleMessageSend}
              />

        </ChatBox>

      </StyledContainer>

    </ChatContainer>
  );
}

export default ChatRoom;
