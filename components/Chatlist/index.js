import React from 'react';

function Chatlist({ joinedChats, handleChatChange }) {
    return (
        <div>
            <h3>Joined Chats</h3>
            {joinedChats.map((chat) => (
                <button onClick={() => handleChatChange(chat.id)} key={chat.id}>{chat.attributes.chat_name}</button>
            ))}
        </div>
    );
}

export default Chatlist;
