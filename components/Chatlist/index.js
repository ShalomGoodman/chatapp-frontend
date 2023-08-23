import React, { useState } from 'react';

function Chatlist({ joinedChats, handleChatChange, leaveFromChat, deleteChat, username }) {
    const [hoveredChat, setHoveredChat] = useState(null);

    const handleMouseEnter = (id) => {
        setHoveredChat(id);
    };

    const handleMouseLeave = () => {
        setHoveredChat(null);
    };

    return (
        <div>
            <h3>Joined Chats</h3>
            <style jsx>{`
                .chat-container {
                    position: relative;
                    width: 100%;
                }
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

                .action-buttons {
                    position: absolute;
                    right: 0;
                    top: 0;
                    display: none;
                }

                .delete-button, .leave-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                }

                .chat-container:hover .action-buttons {
                    display: block;
                }
            `}</style>
            {joinedChats.map((chat) => (
                <div
                    className="chat-container"
                    onMouseEnter={() => handleMouseEnter(chat.id)}
                    onMouseLeave={handleMouseLeave}
                    key={chat.id}
                >
                    <button
                        onClick={() => handleChatChange(chat.id)}
                        className="chat-button"
                    >
                        🔒 {chat.attributes.chat_name}
                    </button>
                    {hoveredChat === chat.id && chat.attributes.chat_name !== "general" && (
                        <div className="action-buttons">
                            {chat.attributes.admin == username && chat.attributes.chat_name !== "general" && (
                                <button
                                    onClick={() => deleteChat(chat.id)}
                                    className="delete-button"
                                >
                                    🗑️
                                </button>
                            )}
                            <button
                                onClick={() => leaveFromChat(chat.id)}
                                className="leave-button"
                            >
                                ✌️
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Chatlist;
