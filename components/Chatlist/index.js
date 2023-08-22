/* eslint-disable react/no-unknown-property */

import React from 'react';

function Chatlist({ joinedChats, handleChatChange }) {
    return (
        <div>
            <h3>Joined Chats</h3>
            <style jsx>{`
                .chat-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    text-align: left !important; // Ensure left alignment
                    padding: 5px;
                    width: 100%;
                    display: block; // Display as block to take up full width
                    font-size: 1rem;
                    color: inherit;
                    outline: none;
                    border-radius: 10px;
                    transition: background 0.3s, color 0.3s;
                }

                .chat-button:hover {
                    background-color: rgba(255, 255, 255, 0.5);
                    border-radius: 10px;
                }
            `}</style>
            {joinedChats.map((chat) => (
                <button
                    onClick={() => handleChatChange(chat.id)}
                    key={chat.id}
                    className="chat-button"
                >
                    🔒 {chat.attributes.chat_name}
                </button>
            ))}
        </div>
    );
}

export default Chatlist;
