import React, { useState } from 'react';

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
      } else {
        console.log('Chatroom not found.');
      }
      setChatroom('');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleChange = (e) => {
    setChatroom(e.target.value);
  };

  return (
    <div>
      <input onChange={handleChange} type="text" placeholder="Search" />
      <button onClick={handleSubmit} type="submit">Join</button>
    </div>
  );
}

export default Searchbox;
