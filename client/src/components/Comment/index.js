import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './Comment.module.css';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { MdChatBubble } from 'react-icons/md';

const Comment = ({ id, user, upvotes, text, createdAt, children }) => {
  const nestedComments = (children || []).map((comment) => {
    return (
      <Comment
        id={comment.id}
        user={comment.user}
        upvotes={comment.upvotes}
        text={comment.text}
        createdAt={comment.createdAt}
        children={comment.children}
      />
    );
  });

  return (
    <div key={id} className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.arrows}>
          <GoArrowUp className={styles.icon} />
          <GoArrowDown className={styles.icon} />
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
          <button className={styles.footer__button}>
            <MdChatBubble className={styles.button__icon} />
            <span className={styles.button__text}>Reply</span>
          </button>
        </div>
        {nestedComments}
      </div>
    </div>
  );
};

Comment.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  upvotes: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  children: PropTypes.array,
};

export default Comment;
