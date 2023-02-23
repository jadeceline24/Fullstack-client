import React, {useContext, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../helpers/AuthContext';

const Login = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();
  const {setAuth} = useContext(AuthContext);
  const login = () => {
    const data = {username: username, password: password};
    axios.post('http://localhost:3001/auth/login', data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem('accessToken', response.data.token);
        setAuth({username: response.data.username, id: response.data.id, status: true});
        navigate('/');
      }
    });
  };
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setusername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}> Login </button>
    </div>
  );
};

export default Login;
