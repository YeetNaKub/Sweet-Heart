// Login.js
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const Login = ({ onLogin }) => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
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
        }
        else{
          navigate('/');
        }
    })
      .catch(error => console.log('error', error));
  }, [])

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  
  const handleKeyPress = (e) => {
    if (e.key=='Enter') {
      if (e.target.name === 'username') {
        document.getElementById('passwordInput').focus();
      } 
      else if (e.target.name === 'password') {
        handleLogin(e);
      }
    }
  }

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = (e) => {
    if (username.trim() !== '') {
        e.preventDefault();
        // let timerInterval;
        // Swal.fire({
        //   timer: 5000,
        //   timerProgressBar: true,
        //   didOpen: () => {
        //     Swal.showLoading();
        //     // const timer = Swal.getPopup().querySelector("b");
        //     // timerInterval = setInterval(() => {
        //     //   timer.textContent = `${Swal.getTimerLeft()}`;
        //     // }, 100);
        //   },
        //   willClose: () => {
        //     clearInterval(timerInterval);
        //   }
        // })
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Sec-Fetch-Mode", "no-cors");
        // myHeaders.append("ngrok-skip-browser-warning", true);
        // myHeaders.append("Access-Control-Allow-Origin", "*");

        var raw = JSON.stringify({
            "username": username,
            "password": password
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        fetch("https://lionfish-wired-fairly.ngrok-free.app/api/Login", requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.status=='success'){
                  MySwal.fire({
                    html:<i>{result.message}</i>,
                    icon: 'success'
                  }).then((value)=>{
                    localStorage.setItem('token',result.token);
                    navigate('/');
                  })
                }
                else{
                  MySwal.fire({
                    html:<i>{result.message}</i>,
                    icon: 'error'
                  })
                }
            })
            .catch(error => 
              MySwal.fire({
                html:<i>Error</i>,
                icon: 'error'
              })
              );
    }
  };
  const handleForget = () => {
    Swal.fire({
      title: "ลืมรหัสผ่านหรอ?",
      text: "นึกให้ออกสิ!",
      icon: "question"
    });
  };

  return (
    <div className='main'>
      <div className="screen-1">
      <h1>Sweet Heart</h1>
        <div className="email">
          <label htmlFor="email">Username</label>
          <div className="sec-2">
            <ion-icon name="mail-outline"></ion-icon>
            <input type="email" name="username" value={username} onChange={handleUsernameChange} onKeyDown={handleKeyPress} />
          </div>
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <div className="sec-2">
            <ion-icon name="lock-closed-outline"></ion-icon>
            <input className="pas" type="password" name="password" id="passwordInput" value={password} onChange={handlePasswordChange} onKeyDown={handleKeyPress}/>
          </div>
        </div>
        <button className="login" onClick={handleLogin}>Login </button>
        <div className="footer"><span onClick={handleRegister}>Signup</span><span onClick={handleForget}>Forgot Password?</span></div>
      </div>
    {/* value={password} onChange={handlePasswordChange}  */}
      {/* <h2>Login</h2>
      <label>
        Username:
        <input type="text" name="username" value={username} onChange={handleUsernameChange} onKeyDown={handleKeyPress} />
      </label>
      <label>
        Password:
        <input type="password" name="password" id="passwordInput" value={password} onChange={handlePasswordChange} onKeyDown={handleKeyPress}/>
      </label>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button> */}
    </div>
  );
};

export default Login;
