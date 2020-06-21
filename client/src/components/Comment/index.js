import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { MdChatBubble } from 'react-icons/md';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { Link } from 'react-router-dom';
import styles from './Comment.module.css';
import RichTextEditor from '../RichTextEditor';
import Button from '../Button';
import { createComment, voteComment } from '../../redux/comments';

const ReplyEditor = ({ postId, parentId }) => {
  const dispatch = useDispatch();

  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('POST', postId);
    dispatch(createComment({ post_id: postId, parent_id: parentId, text }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <RichTextEditor value={text} onChange={setText} />
      <Button type='submit'>Reply</Button>
    </form>
  );
};

const Comment = ({
  id,
  postId,
  user,
  upvotes,
  text,
  voteDirection,
  createdAt,
  children,
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showEditor, setShowEditor] = useState(false);

  const nestedComments = (children || []).map((comment) => {
    return (
      <Comment
        key={comment.id}
        id={comment.id}
        postId={comment.post_id}
        user={comment.user_name}
        upvotes={comment.upvotes}
        voteDirection={comment.vote}
        text={comment.text}
        createdAt={comment.created_at}
        children={comment.children}
      />
    );
  });

  return (
    <div key={id} className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.arrows}>
          <GoArrowUp
            className={`${styles.icon} ${styles.upvote} ${
              voteDirection && styles.upvoted
            }`}
            onClick={(event) => {
              event.stopPropagation();
              if (isAuthenticated) {
                dispatch(voteComment(id, true));
              }
            }}
          />
          <GoArrowDown
            className={`${styles.icon} ${styles.downvote} ${
              typeof voteDirection === 'boolean' &&
              !voteDirection &&
              styles.downvoted
            }`}
            onClick={(event) => {
              event.stopPropagation();
              if (isAuthenticated) {
                dispatch(voteComment(id, false));
              }
            }}
          />
        </div>
        <div className={styles.vertical__line} />
      </aside>
      <div className={styles.main}>
        <div className={styles.header}>
          <Link to={`/u/${user}`} className={styles.user}>
            {user}
          </Link>
          <span className={styles.upvotes}>{upvotes || 0} points</span>
          <span className={styles.createdAt}>
            {moment(createdAt).fromNow()}
          </span>
        </div>
        <span dangerouslySetInnerHTML={{ __html: text }} />
        <div className={styles.footer}>
          <button
            className={styles.footer__button}
            onClick={() => setShowEditor((prevShow) => !prevShow)}
          >
            <MdChatBubble className={styles.button__icon} />
            <span className={styles.button__text}>Reply</span>
          </button>
        </div>
        {showEditor && <ReplyEditor postId={postId} parentId={id} />}
        {nestedComments}
      </div>
    </div>
  );
};

Comment.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  upvotes: PropTypes.number,
  children: PropTypes.array,
};

export default Comment;
