import React, {useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../helpers/AuthContext';
import {useNavigate} from 'react-router-dom';

function Post() {
  let {id} = useParams();
  const [postList, setPostList] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const {Auth} = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostList(response.data);
    });
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        'http://localhost:3001/comments',
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        },
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
            id: response.data.id,
          };
          setComments([...comments, commentToAdd]);
          setNewComment('');
        }
      });
  };
  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
        },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          }),
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
        },
      })
      .then(() => {
        navigate('/');
      });
  };
  const editPost = (option) => {
    if (option === 'title') {
      let newTitle = prompt('Enter new title');
      axios.put(
        'http://localhost:3001/posts/title',
        {newTitle: newTitle, id: id},
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        },
      );
      setPostList({...postList, title: newTitle});
    } else {
      let newBody = prompt('Enter new body');
      axios.put(
        'http://localhost:3001/posts/postText',
        {newText: newBody, id: id},
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        },
      );
      setPostList({...postList, postText: newBody});
    }
  };
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (Auth.username === postList.username) {
                editPost('title');
              }
            }}
          >
            {' '}
            {postList.title}{' '}
          </div>
          <div
            className="body"
            onClick={() => {
              if (Auth.username === postList.username) {
                editPost('body');
              }
            }}
          >
            {postList.postText}
          </div>
          <div className="footer">
            {postList.username}
            {Auth.username === postList.username && (
              <button
                onClick={() => {
                  deletePost(postList.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label> Username: {comment.username}</label>
                {Auth.username === comment.username && (
                  <button onClick={() => deleteComment(comment.id)}>x</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
