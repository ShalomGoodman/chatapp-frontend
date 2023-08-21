import React from 'react';

function ChatCreate({ setChatName, handleChatCreate, chatName }) {
    return (
        <div>
          <h3>Create a Chat</h3>
          <input onChange={(e) => setChatName(e.target.value)} type="text" placeholder="Make a chat name" />
          <button onClick={handleChatCreate} disabled={chatName == ''}>Create Chat</button>
        </div>
    );
}

export default ChatCreate;