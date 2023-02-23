import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../helpers/AuthContext';
const Profile = () => {
  const [username, setUsername] = useState('');
  const [listOfPosts, setListOfPosts] = useState([]);
  let {id} = useParams();
  const navigate = useNavigate();
  const {Auth} = useContext(AuthContext);
  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicInfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);
  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        {' '}
        <h1> Username: {username} </h1>
        {Auth.username === username && (
          <button
            onClick={() => {
              navigate('/changepass');
            }}
          >
            {' '}
            Change Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              <div
                className="body"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <label> {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
