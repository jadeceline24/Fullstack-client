import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import NotFound from './pages/404';
import Registration from './pages/Registration';
import {AuthContext} from './helpers/AuthContext';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

function App() {
  const [Auth, setAuth] = useState({username: '', id: 0, status: false});
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setAuth({...Auth, status: true});
    } else {
      axios
        .get('http:localhost/3001/auth/auth', {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        })
        .then((response) => {
          if (response.data.error) {
            setAuth({...Auth, status: false});
          } else {
            setAuth({
              username: response.data.username,
              id: response.data.id,
              status: true,
            });
          }
        });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAuth({username: '', id: 0, status: false});
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{Auth, setAuth}}>
        <Router>
          <div className="navbar">
            {!Auth.status ? (
              <>
                <Link to="/login"> Login</Link>
                <Link to="/registration"> Registration</Link>
              </>
            ) : (
              <>
                <Link to="/"> Home Page</Link>
                <Link to="/createpost"> Create A Post</Link>
              </>
            )}
            <div className="loggedInContainer">
              <h1>{Auth.username} </h1>
              {Auth.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepass" element={<ChangePassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
