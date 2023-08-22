import React from 'react';

function ChatCreate({ setChatName, handleChatCreate, chatName }) {
    return (
        <div>
          <h3>Create a Chat</h3>
          <input 
            onChange={(e) => setChatName(e.target.value)}
            type="text"
            placeholder="Make a chat name"
            style={
              {
                width: "63%",
                padding: "5px",
                border: "none",
                borderRadius: "5px",
                marginBottom: "10px",
                marginRight: "10px",
              }
            }
            />
          <button onClick={handleChatCreate} disabled={chatName == ''}>Create Chat</button>
        </div>
    );
}

export default ChatCreate;