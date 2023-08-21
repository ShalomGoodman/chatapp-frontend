import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Searchbox({ chatChange, activeUser }) {
  const [chatroom, setChatroom] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/chatrooms`);
      const response = await res.json();
      const selectedChatroom = response.data.find((chat) => chat.attributes.chat_name === chatroom);
      if (selectedChatroom) {
        chatChange(selectedChatroom.id);

        // Update the active user to add the chatroom
        const updatedActiveUserData = {
          data: {
            chatrooms: {
              connect: [{ id: selectedChatroom.id }]
            }
          }
        };

        await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/active-users/${activeUser}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedActiveUserData),
        });
        setChatroom('');
        toast.success(`Successfully Joined chatroom ${chatroom}`);
      } else {
        console.log('Chatroom not found.');
        toast.error(`Chatroom "${chatroom}" not found. Please check the name and try again.`);
      }
      setChatroom('');
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error(`An error occurred while joining the chatroom: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    setChatroom(e.target.value);
  };

  return (
    <div>
      <h3>Join a Chat</h3>
      <input onChange={handleChange} type="text" placeholder="Search" />
      <button onClick={handleSubmit} disabled={chatroom == ''} type="submit">Join</button>
    </div>
  );
}

export default Searchbox;
