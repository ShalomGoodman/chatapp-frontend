import React from 'react';

// CSS class for the hover effect on the button
const buttonStyle = {
    height: '50px',
    width: '100px',
    fontSize: '16px',
    backgroundColor: '#91bed4',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer' // Change the cursor to pointer on hover
};

const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#7aa8b5' // A darker shade for hover effect
};

function MessageInput({ message, setMessage, handleMessageSend }) {
    const [isButtonHovered, setIsButtonHovered] = React.useState(false); // State to manage the hover effect

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        handleMessageSend();
                    }
                }}
                style={{
                    flex: 1,
                    height: '50px',
                    marginRight: '0px',
                    padding: '10px',
                    fontSize: '16px',
                    border: 'none',
                    backgroundColor: '#f0f0f0',
                    outline: 'none' // Remove the black border on focus
                }}
            />
            <button
                onClick={handleMessageSend}
                onMouseEnter={() => setIsButtonHovered(true)} // Handle mouse enter
                onMouseLeave={() => setIsButtonHovered(false)} // Handle mouse leave
                style={isButtonHovered ? buttonHoverStyle : buttonStyle} // Apply the correct style based on hover state
            >
                Send
            </button>
        </div>
    );
}

export default MessageInput;
