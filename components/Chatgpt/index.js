import React, { useState } from 'react';
import Messages from '../Messages';
import MessageInput from '../MessageInput';

function Chatgpt(username) {
    const [Input, setInput] = useState("");
    const [messages, setMessages] = useState([]);


    async function onSubmit(event) {

        try {
            console.log("Input:", Input);
            console.log("Messages:", messages);
            console.log("Username:", username, "Type:", typeof username);
            // Append user message to messages array
            const usersName = username.username;
            setMessages(prevMessages => [...prevMessages, { user: usersName, message: Input, createdAt: Date.now()}]);

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: Input, context: messages, username: username}),
            })

            if (!response.ok) {
                const text = await response.text();
                console.error('Server error:', text);
                throw new Error(`Server error: ${text}`);
            }

            const data = await response.json();
            // Append AI message to messages array
            setMessages(prevMessages => [...prevMessages, { user: 'AI', message: data.result, createdAt: Date.now()}]);


            setInput("");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div>
            <title>AI Chatbot</title>
            <main>
                <Messages messages={messages} username={username} />
                <MessageInput setMessage={setInput} message={Input} handleMessageSend={onSubmit} />
            </main>
        </div>
    );
}

export default Chatgpt;
