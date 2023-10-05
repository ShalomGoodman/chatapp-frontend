import React, { useState } from 'react';
import Messages from '../Messages';
import MessageInput from '../MessageInput';
import { Configuration, OpenAIApi } from "openai";

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
            setMessages(prevMessages => [...prevMessages, { sender: usersName, text: Input }]);

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: Input, context: messages }),
            })

            if (!response.ok) {
                const text = await response.text();
                console.error('Server error:', text);
                throw new Error(`Server error: ${text}`);
            }

            const data = await response.json();
            // Append AI message to messages array
            setMessages(prevMessages => [...prevMessages, { sender: 'AI', text: data.result }]);


            setInput("");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    async function handleGenerate(req, res) {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const input = req.body.input || '';
        const context = req.body.context || [];

        if (input.trim().length === 0) {
            res.status(400).json({
                error: {
                    message: "Please enter a valid input",
                }
            });
            return;
        }

        try {
            const prompt = generatePrompt(input, context);

            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0.1,
                max_tokens: 2048,
            });

            console.log(completion.data)

            res.status(200).json({ result: completion.data.choices[0].text });
        } catch (error) {
            // Consider adjusting the error handling logic for your use case
            if (error.response) {
                console.error(error.response.status, error.response.data);
                res.status(error.response.status).json(error.response.data);
            } else {
                console.error(`Error with OpenAI API request: ${error.message}`);
                res.status(500).json({
                    error: {
                        message: 'An error occurred during your request.',
                    }
                });
            }
        }
    }

    function generatePrompt(input, context) {
        const conversation = context.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
        return `You are a Shoe salesman named "Pete"\n\n${conversation}\nUser: ${input}\nPete:`;
    }

    return (
        <div>
            <title>AI Chatbot</title>
            <main>
                <h3>AI Chatbot</h3>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message.sender}: {message.text}</li>
                    ))}
                </ul>
                {/* <Messages messages={messages} username={username} /> */}
                <MessageInput setMessage={setInput} message={Input} handleMessageSend={onSubmit} />
            </main>
        </div>
    );
}

export default Chatgpt;
