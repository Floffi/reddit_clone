import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { MdChatBubble } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './PostCard.module.css';
import { vote } from '../../redux/posts';

const PostCard = ({
  id,
  communityName,
  userName,
  title,
  text,
  upvotes,
  voteDirection,
  createdAt,
}) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.post__card}>
      <div className={styles.aside}>
        <div className={styles.arrows}>
          <GoArrowUp
            className={`${styles.icon} ${styles.upvote} ${
              voteDirection && styles.upvoted
            }`}
            onClick={() => dispatch(vote(id, true))}
          />
          <span className={styles.votes}>{upvotes}</span>
          <GoArrowDown
            className={`${styles.icon} ${styles.downvote} ${
              typeof voteDirection === 'boolean' &&
              !voteDirection &&
              styles.downvoted
            }`}
            onClick={() => dispatch(vote(id, false))}
          />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.header}>
          <Link to={`/c/${communityName}`} className={styles.community}>
            c/{communityName}
          </Link>
          <div className={styles.author}>
            <span>Posted by</span>
            <Link to='/' className={styles.author__link}>
              u/{userName}
            </Link>
          </div>
          <span className={styles.date}>{moment(createdAt).fromNow()}</span>
        </div>
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </div>
        <div className={styles.footer}>
          <button className={styles.button}>
            <MdChatBubble />
            <span className={styles.comments}>1421 Comments</span>
          </button>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {};

export default PostCard;
