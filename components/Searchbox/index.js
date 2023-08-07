import React from 'react'
import { useState } from 'react'

function Searchbox({ chatChange }) {

    const [chatroom, setChatroom] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        chatChange(chatroom);
    }

    const handleChange = (e) => {
        setChatroom(e.target.value);
    }

    return (
        <div>
            <input onChange={handleChange} type="text" placeholder="Search" />
            <button onClick={handleSubmit} type="submit">Join</button>
        </div>
    )
}

export default Searchbox
