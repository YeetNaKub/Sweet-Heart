
import React, { useState } from 'react';
import { json, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Register = ({ onRegister }) => {
    
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // New state for selected image

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleFirstnameChange = (e) => {
    const firstname = e.target.value;
    const transformedValue = firstname.charAt(0).toUpperCase() + firstname.slice(1);
    setFirstname(transformedValue);
  };
  const handleLastnameChange = (e) => {
    const lastname = e.target.value;
    const transformedValue = lastname.charAt(0).toUpperCase() + lastname.slice(1);
    setLastname(transformedValue);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleKeyPress1 = (e) => {
    const isNumeric = /^[0-9\b]+$/.test(e.key);
    if (!isNumeric && e.key!='Backspace') {
      e.preventDefault();
    }
    if (e.key=='Enter') {
      if (e.target.name === 'phone') {
        Create(e);
      }
    }
  };
  const handleKeyPress = (e) => {
    if (e.key=='Enter') {
      if (e.target.name === 'username') {
        document.getElementById('passwordInput').focus();
      } 
      else if (e.target.name === 'password') {
        document.getElementById('firstnameInput').focus();
      }
      else if (e.target.name === 'firstname') {
        document.getElementById('lastnameInput').focus();
      }
      else if (e.target.name === 'lastname') {
        document.getElementById('phoneInput').focus();
      }
    }
  }

  // New function to handle image selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const log = (e) =>{
    navigate('/Login');
  }

  const Create = (e) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var formData = JSON.stringify({
      "username": username,
      "password": password,
      "firstname": firstname,
      "lastname": lastname,
      "phone": phone,
  });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    };

    fetch("https://lionfish-wired-fairly.ngrok-free.app/api/Register", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'Ok') {
          MySwal.fire({
            html: <i>{result.message}</i>,
            icon: 'success'
          }).then((value) => {
            navigate('/Login');
          })
        } else {
          console.log(result.message)
          MySwal.fire({
            html: <i>{result.message}</i>,
            icon: 'error'
          })
        }
      })
      .catch(error => console.log('error', error));
  };

  return (
    <div>
      <div className="screen-1">
      <h1>Register</h1>
      
        <div className="email">
          <label htmlFor="email">Username</label>
          <div className="sec-2">
            <ion-icon name="mail-outline"></ion-icon>
            <input type="text" name="username" value={username} onChange={handleUsernameChange} onKeyDown={handleKeyPress}/>
          </div>
          <label htmlFor="email">Password</label>
          <div className="sec-2">
            <ion-icon name="lock-closed-outline"></ion-icon>
            <input type="password" name="password" id="passwordInput" value={password} onChange={handlePasswordChange} onKeyDown={handleKeyPress}/>
          </div>
          <label htmlFor="email">Firstname</label>
          <div className="sec-2">
            <ion-icon name="document-text-outline"></ion-icon>
            <input type="text" name="firstname" id="firstnameInput" value={firstname} onChange={handleFirstnameChange} onKeyDown={handleKeyPress}/>
          </div>
          <label htmlFor="email">Lastname</label>
          <div className="sec-2">
            <ion-icon name="document-text-outline"></ion-icon>
            <input type="text" name="lastname" id="lastnameInput" value={lastname} onChange={handleLastnameChange} onKeyDown={handleKeyPress}/>
          </div>
          <label htmlFor="email">Phone</label>
          <div className="sec-2">
            <ion-icon name="phone-portrait-outline"></ion-icon>
            <input type="text" name="phone" id="phoneInput" value={phone} onChange={handlePhoneChange} onKeyDown={handleKeyPress1} minLength="10" maxLength="10" required/>
          </div>
        </div>

        <button className="login" onClick={Create}>Create </button>
        <div className="footers"><span onClick={log}>Login</span></div>
      </div>
      {/* <h2>Login</h2>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <label>
        Password:
        <input type="text" value={password} onChange={handlePasswordChange} />
      </label>
      <label>
        Firstname:
        <input type="text" value={firstname} onChange={handleFirstnameChange} />
      </label>
      <label>
        Lastname:
        <input type="text" value={lastname} onChange={handleLastnameChange} />
      </label>
      <label>
        Phone:
        <input type="text" value={phone} onChange={handlePhoneChange} />
      </label>
      <label>
        Choose Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      <button onClick={Create}>Create Account</button> */}
    </div>
  );
};

export default Register;
