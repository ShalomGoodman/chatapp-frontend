import React from 'react';

function ChatHeader({ currentChatName, currentChatUsers }) {
  return (
    <div style={{
      padding: "20px",
      paddingTop: "25px",
      backgroundColor: "#91bed4",
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden', // Contain the children elements
      height: '60px', // Set the fixed height
    }}>
      <h2 style={{ display: 'inline-block', lineHeight: '20px' }}>#{currentChatName}</h2>
      <div style={{
        display: 'inline-block',
        marginLeft: '10px',
        whiteSpace: 'nowrap', // Prevents the text from breaking into multiple lines
        overflow: 'hidden', // Hides the text that overflows the container
        textOverflow: 'ellipsis', // Adds an ellipsis when the text overflows
        maxWidth: 'calc(100% - yourH2WidthHere)', // You may want to adjust this value
        lineHeight: '20px', // Aligns the text vertically
      }}>
        {currentChatUsers.map(user => user.users).join(', ')}
      </div>
    </div>
  );
}

export default ChatHeader;
