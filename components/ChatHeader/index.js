import React from 'react';

function ChatHeader({ currentChatName, currentChatUsers }) {
    return (
        <div style={
            {
              paddingTop: "10px",
              paddingLeft: "20px",
              backgroundColor: "#91bed4",
            }
          }>
            <h2 style={{ display: 'inline-block' }}>#{currentChatName}</h2>
            <div style={{ display: 'inline-block', marginLeft: '10px' }}>
              {currentChatUsers.map(user => user.users).join(', ')}
            </div>
          </div>
    );
}

export default ChatHeader;
