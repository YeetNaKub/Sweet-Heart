import React, { useState,useEffect,useRef } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { boolean } from 'mathjs';
import Pusher from 'pusher-js';
import ImageModal from './ImageModal';
import copy from 'clipboard-copy';
import Chatpage from './Chatpage';

const App = () => {
  const API_KEY = "9538e91c363d16372741";
  const API_CLUSTER = "ap1";
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [namechat, setNameChat] = useState(0);
  const [chating, setChating] = useState(false);
  const [loadchat, setLoadchat] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const colors = ['#3498db', '#e74c3c', '#4caf50', '#f39c12', '#8e24aa'];
  const colorsoppo = ['#82b5d7', '#bfa7a5', '#a3d2ca', '#f4dcb6', '#d298e9'];
  const [themeColorOppo, setThemeColorOppo] = useState('#a3d2ca');
  // let isSubscribed = false;
  // let currentChannel = null;
  // var pusher = null;
  
  const pusher = useRef(null);
  const channel = useRef(null);
  let chati = 0;
  
  const [reversedChat, setReversedChat] = useState([]);
  const [chatToken, setChatToken] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // Generate an array with 5 items
  const items = Array.from({ length: 5 }, (_, index) => index + 1)
  
  const [themeColor, setThmeColor] = useState('#4caf50');
  const containerRef = useRef(null);const textRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // File selected, trigger handleImageUpload
      handleSendImage(selectedFile);
    }
  };

  const handleCopyClick = () => {
    const value = textRef.current.value;
    copy(value);
    alert('Copied to clipboard!');
  };

  useEffect(() => {
    
    // Scroll to the bottom when messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Initialize Pusher with your app key
    
  }, [])

  // const triggerEvent = () => {
  //   // In a real scenario, this would be an API call to your server
  //   fetch('http://localhost:3001/trigger-event', { method: 'POST' })
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  //     .catch(error => console.error('Error:', error));
  // };
  
  useEffect(() => {
    setThemeColorOppo(localStorage.getItem('colorsoppo'));
    setThmeColor(localStorage.getItem('colors'));
    const token =localStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append("Authorization", ("Bearer " + token));
    myHeaders.append("ngrok-skip-browser-warning", true);
    // myHeaders.append("Sec-Fetch-Mode", "no-cors");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch("https://lionfish-wired-fairly.ngrok-free.app/api/GetProfile", requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.status === 'error'){
          MySwal.fire({
          html:<i>{"Session Expired!"}</i>,
          icon: 'error'
        }).then((value)=>{
          navigate('/Login');
        })
        }
        else{
          setUser(result.user);
          setChatToken(result.user.chattoken.slice().reverse());
          setIsLoaded(true);
        }
    })
      .catch(error => console.log('error', error));
      

  }, [])

  useEffect(() => {
    // Initialize Pusher with your app key
    pusher.current = new Pusher(API_KEY, {
      cluster: API_CLUSTER,
      encrypted: true
    });

    return () => {
      // Clean up Pusher connection when component unmounts
      if (pusher.current) {
        pusher.current.disconnect();
      }
    };
  }, []);
    useEffect(() => {
      const token =localStorage.getItem('token');
      var myHeaders = new Headers();
      myHeaders.append("Authorization", ("Bearer " + token));
      myHeaders.append("ngrok-skip-browser-warning", true);
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      fetch("https://lionfish-wired-fairly.ngrok-free.app/api/GetFriend", requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 'error'){
            MySwal.fire({
            html:<i>{"Session Expired!"}</i>,
            icon: 'error'
          }).then((value)=>{
            navigate('/Login');
          })
          }
          else{
            setChat(result);
          }
      })
        .catch(error => console.log('error', error));
        

    }, [])


  const triggerFileInputClick = () => {
    fileInputRef.current.click();
  };
  
  const handleItemClick = (event) => {
    const clickedItemId = event.target.id;
    setThmeColor(colors[clickedItemId]);
    localStorage.setItem('colors',colors[clickedItemId])
    setThemeColorOppo(colorsoppo[clickedItemId])
    localStorage.setItem('colorsoppo',colorsoppo[clickedItemId])
  };
  const handleKeyPress = (e) => {
    if (e.key=='Enter') {
      if (e.target.name === 'typing') {
        handleSendMessage();
      } 
    }
  }
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    chati=localStorage.getItem('chatid')
    if (inputMessage.trim() !== '') {
      // setMessages([...messages, { message: inputMessage, messageType: "text", role: user.username }]);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "role": user.username,
        "messageType": "text",
        "message": inputMessage
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://lionfish-wired-fairly.ngrok-free.app/api/messages/send/"+chatToken[chati], requestOptions)
        .then(response => response.text())
        .then(result => {})
        .catch(error => console.log('error', error));
      setInputMessage('');
    }
  };
  const disconnectFromChannels = () => {
    if (pusher.current) {
      Object.values(pusher.current.channels.channels).forEach(channel => {
        channel.unbind_all();
        pusher.current.unsubscribe(channel.name);
      });
    }
  };
  const subscribe = (token) =>{
    // if (isSubscribed) {
    //   currentChannel.unbind('sendMessage');
    //   pusher.unsubscribe(token);
    //   // console.log("aaa");
    //   isSubscribed = false;
    // }
    channel.current = pusher.current.subscribe(token);

    channel.current.bind('sendMessage', function(data) {
      setMessages((messages) => [...messages, data]);
    });
    
    // pusher = new Pusher(API_KEY, {
    //   cluster: API_CLUSTER,
    //   encrypted: true
    // });
    // // Subscribe to a channel
    // pusher.unsubscribe(oldt);
    // const channel = pusher.subscribe(token);

    // channel.bind('sendMessage', function(data) {
    //   // messages.push({ message: data.message, messageType: data.messageType, role: data.role });
    //   setMessages(messages => [...messages, data]);
    //   // setMessages([...messages, { message: data.message, messageType: data.messageType, role: data.role }]);
    //   // Handle the data as needed
    // });
    
    // return () => {
      
    //   channel.unbind('sendMessage');
    //   pusher.unsubscribe(token);
    //   isSubscribed = false;
    // };
  }
  const handleSendImage = (selectedFile) => {
      chati=localStorage.getItem('chatid')
      var formdata = new FormData();
      formdata.append("image", selectedFile);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      fetch("https://lionfish-wired-fairly.ngrok-free.app/api/ForTest/UploadImage", requestOptions)
        .then(response => response.text())
        .then(result => {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify({
            "role": user.username,
            "messageType": "image",
            "message": result
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("https://lionfish-wired-fairly.ngrok-free.app/api/messages/send/"+chatToken[chati], requestOptions)
            .then(response => response.text())
            .then(result => {})
            .catch(error => console.log('error', error));
          setInputMessage('');
          
        })
        .catch(error => console.log('error', error));

    
  };
  const handleChat = (index)=>{
    if(chat.length!=0){
      setReversedChat(chat.slice().reverse())
    }
    setNameChat(index);
    localStorage.removeItem('chatid');
    localStorage.setItem('chatid',index);
    // if(isSubscribed=="true"){
    //   pusher.unsubscribe("bbe28e91-93b9-4803-b5f2-c009046b52d3");
    //   console.log("eiei");
    //   localStorage.setItem('Subscribe',false);
    // }
    // if(pusher!=null){
    //   pusher.unsubscribe(oldt);
    // }
    disconnectFromChannels();
    const token = chatToken[index];
    subscribe(token);

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("https://lionfish-wired-fairly.ngrok-free.app/api/messages/"+chatToken[index], requestOptions)
      .then(response => response.json())
      .then(result => {
        setMessages(result);
      })
      .catch(error => console.log('error', error));
    setChating(true);
    setLoadchat(true);
    handleToggleLeftPanel();
  };
  const handleToggleLeftPanel = () => {
    setShowLeftPanel(!showLeftPanel);
  };
  const profile = ()=>{
    setChating(false);
    setLoadchat(false);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };
  const showAlertWithInput = () => {
    Swal.fire({
      title: "Add Friend",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Add",
      showLoaderOnConfirm: true,
      preConfirm: async (username) => {
        try {
          var formdata = new FormData();
          formdata.append("username", username);

          
          const token =localStorage.getItem('token');
          var myHeaders = new Headers();
          myHeaders.append("Authorization", ("Bearer " + token));
          myHeaders.append("ngrok-skip-browser-warning", true);
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
          };
          const response = await fetch("https://lionfish-wired-fairly.ngrok-free.app/api/AddFriend", requestOptions)
          if (!response.ok) {
            return Swal.showValidationMessage(`
              Username Not Found!
            `);
          }
          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then( async (result) => {
      if (result.isConfirmed) {
        const result = await Swal.fire({
          title: `Add Friend Successed`,
          icon: 'success'
        });
        if (result.isConfirmed) {
          window.location.reload();
        }
      }
    });
  };


  if (!isLoaded) {
    return <div>Loading...</div>;
  } 
  else {
    return (
      <div className='chat'>
      <div className={`left-pane ${showLeftPanel ? 'show' : ''}`}>
        <div className='row'>
          <h2>Friend</h2>
          <button onClick={showAlertWithInput} className='addbut'>+</button>
          </div>
          <div className='container'>
            {chat.length === 0 ? (
                    <h4 align="center">You don't have any friends yet.</h4>
                  ) : 
                  <div className='container1'>
                    <ul style={{ paddingLeft: '0px' }}>
                    {chat.slice().reverse().map((chat, index) => (
                        <div className="message-box" onClick={() => handleChat(index)} key={index}>
                          <img src={chat.imageurl} alt="Avatar" className="avatar" draggable="false" />
                          <div className="name" style={{ userSelect: "none" }} >{chat.firstname} {chat.lastname}</div>
                          <div className="message" style={{ userSelect: "none" }}>: Let's Start Talking</div>
                      </div>
                    ))}
                  </ul>
                </div>
            }
          </div>
          
      </div>
      <div className="right-pane">
      {chating ? (
        <div>
          <div className='row'>
            <h4>{reversedChat[namechat].firstname} {reversedChat[namechat].lastname}</h4>
            <img onClick={profile} src={user.imageurl} alt="Your Profile" style={{borderRadius: '50%',width: '50px',height: '50px',border: '1px solid #000000'}} />
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
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
              onClick={(e) => e.target.value = null} // Reset file input value to allow selecting the same file again
            />
            <div className='imageSelect' style={{ color: themeColor }} onClick={triggerFileInputClick}>
              <ion-icon name="image-outline"></ion-icon>
            </div>
            {/* <div onClick={handleSendImage} style={{ color: themeColor }} className='imageSelect'>
              <ion-icon name="image-outline"></ion-icon>
            </div> */}
            <button className='sending' style={{ background: themeColor }} onClick={handleSendMessage}>Send</button>
          </div>
          </div>
          ) : (
            <div>
              <h4 align="center">Loading.....</h4>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className='row'>
            <h4>Hello {user.firstname} {user.lastname}!</h4>
            {/* <button className='right' onClick={handleLogout}>Logout</button> */}
          </div>
          <h4 align="center">Coming Soon....</h4>
          <div className="input-container">
            <label>Your Username : </label>
            <input className='uservalue' onClick={handleCopyClick} type="text" ref={textRef} value={user.username} readOnly />
            <div style={{ float: 'right' }}>
              <button className='img-button' onClick={openModal}>Upload Image</button>
              <ImageModal isOpen={isModalOpen} closeModal={closeModal} />
              {/* <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button onClick={handleImageUpload}>Select Image</button> */}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="circle-row">
            {items.map((item, index) => (
              <div key={item} className="circle" id={index} style={{ backgroundColor: colors[index] ,cursor: 'pointer'}} onClick={handleItemClick}></div>
            ))}
            </div>
          </div>
          <div align="center">
          <button onClick={showAlertWithInput} className='mobile-add-button'> Add Friend</button>
          </div>
          <div align="center">
          <button onClick={handleLogout} className='log-button'>Logout</button>
          </div>
        </div>
      )}

          
      </div>
      <div className='mobile-menu-button' onClick={handleToggleLeftPanel}>
        <ion-icon name={`${showLeftPanel ? 'close' : 'menu'}`}></ion-icon>
      </div>
      </div>
      // <div className="App">
      //   <button onClick={handleLogout}>Logout</button>
      //   <div className="Chat">
      //     <div className="Messages">
      //       {messages.map((message, index) => (
      //         <div key={index} className="Message">
      //           {message.text}
      //         </div>
      //       ))}
      //     </div>
      //     <div className="InputContainer">
      //       <input
      //         type="text"
      //         placeholder="Type your message..."
      //         value={inputMessage}
      //         onChange={handleInputChange}
      //       />
      //       <button onClick={handleSendMessage}>Send</button>
      //       {/* <img src={user.imageurl}></img> */}
      //     </div>
      //   </div>
      // </div>
    );
  }
};

export default App;
