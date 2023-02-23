import React from 'react';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
function Home() {
  const [listOfPosts, setListofPosts] = useState([]);
  const [likePost, setLikePost] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:3001/posts', {
          headers: {accessToken: localStorage.getItem('accessToken')},
        })
        .then((response) => {
          setListofPosts(response.data.ListofPosts);
          setLikePost(
            response.data.ListofLikes.map((like) => {
              return like.PostId;
            }),
          );
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        'http://localhost:3001/likes',
        {PostId: postId},
        {headers: {accessToken: localStorage.getItem('accessToken')}},
      )
      .then((response) => {
        setListofPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return {...post, Likes: [...post.Likes, 0]};
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return {...post, Likes: likesArray};
              }
            } else {
              return post;
            }
          }),
        );

        if (likePost.includes(postId)) {
          setLikePost(
            likePost.filter((id) => {
              return id !== postId;
            }),
          );
        } else {
          setLikePost([...likePost, postId]);
        }
      });
  };
  return (
    <div>
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
              <Link to={`/profile/${value.UserId}`}> {value.username}</Link>

              <div className="buttons">
                <ThumbUpIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likePost.includes(value.id) ? 'unlikeBttn' : 'likeBttn'
                  }
                />
              </div>
              <label> {value.Likes.length}</label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
