import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

function Chatpage({ reversedChat, namechat, user,token}) {
    const API_KEY = "9538e91c363d16372741";
    const API_CLUSTER = "ap1";
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loadchat, setLoadChat] = useState(false);
    const containerRef = useRef(null);
    let pusher = null;

    useEffect(() => {
        pusher = new Pusher(API_KEY, {
            cluster: API_CLUSTER,
            encrypted: true
        });
        // Subscribe to a channel
        const channel = pusher.subscribe(token);
    
        channel.bind('sendMessage', function(data) {
            setMessages(messages => [...messages, data]);
        });
        
        return () => {
            channel.unbind('sendMessage');
            pusher.unsubscribe(token);
        };
    }, [])

    // Function to handle input change
    const handleInputChange = (event) => {
        setInputMessage(event.target.value);
    };

    // Function to handle key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
        handleSendMessage();
        }
    };

    // Function to handle sending messages
    const handleSendMessage = () => {
        // Add logic to send the message
        // For now, let's just append the message to the list
        const newMessage = {
        message: inputMessage,
        role: user.username, // Assuming user object has a username property
        messageType: 'text', // Assuming it's a text message
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');
    };

    // Function to handle sending images
    const handleSendImage = () => {
        // Add logic to select and send image
    };

    // Function to load chat messages
    useEffect(() => {
        // Add logic to load chat messages
        // For now, let's just simulate loading messages
        setTimeout(() => {
        setMessages([
            // Sample messages, you should replace with your logic to fetch messages
            { message: 'Hello', role: 'sender', messageType: 'text' },
            { message: 'Hi there!', role: 'receiver', messageType: 'text' },
        ]);
        setLoadChat(true);
        }, 2000); // Simulating a 2-second delay for loading messages
    }, []);

    // Function to handle clicking on profile
    const profile = () => {
        // Add logic to handle profile click
    };

    // Theme colors
    const themeColor = '#abcdef'; // Replace with your theme color
    const themeColorOppo = '#fedcba'; // Replace with your theme color for opposite party

return (
    <div>
    <div className='row'>
        <h4>{reversedChat[namechat].firstname} {reversedChat[namechat].lastname}</h4>
        <img onClick={profile} src={user.imageurl} alt="Your Profile" style={{ borderRadius: '50%', width: '50px', height: '50px', border: '1px solid #000000' }} />
    </div>
    {loadchat ? (
        <div>
        <div className='container' ref={containerRef}>
            <ul>
            {/* Render chat messages */}
            {messages.map((message, index) => (
                <div
                key={index}
                style={
                    message.role === user.username
                    ? { background: themeColor }
                    : { background: themeColorOppo }
                }
                className={`chat-bubble ${message.role === user.username ? 'right-bubble' : 'left-bubble'}`}
                >
                {message.messageType === 'text' ? (
                    <a>{message.message}</a>
                ) : message.messageType === 'image' ? (
                    <img src={message.message} style={{ width: '100%', height: 'auto' }} alt="Image" />
                ) : null}
                </div>
            ))}
            </ul>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
            name="typing"
            className='typingbox'
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            autoComplete="off"
            />
            <div onClick={handleSendImage} style={{ color: themeColor }} className='imageSelect'>
            <ion-icon name="image-outline"></ion-icon>
            </div>
            <button className='sending' style={{ background: themeColor }} onClick={handleSendMessage}>Send</button>
        </div>
        </div>
    ) : (
        <div>
        <h4 align="center">Loading.....</h4>
        </div>
    )}
    </div>
    );
}

export default Chatpage;