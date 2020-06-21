import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { MdChatBubble } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './PostCard.module.css';
import { votePost } from '../../redux/posts';

const PostCard = ({
  id,
  communityName,
  userName,
  title,
  text,
  upvotes,
  voteDirection,
  comments,
  createdAt,
  mode = true,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div
      onClick={() => {
        if (mode) {
          history.push(`/c/${communityName}/comments/${id}`);
        }
      }}
      className={`${styles.post__card} ${mode && styles.post__card__mode}`}
    >
      <div className={styles.aside}>
        <div className={styles.arrows}>
          <GoArrowUp
            className={`${styles.icon} ${styles.upvote} ${
              voteDirection && styles.upvoted
            }`}
            onClick={(event) => {
              event.stopPropagation();
              if (isAuthenticated) {
                dispatch(votePost(id, true));
              }
            }}
          />
          <span className={styles.votes}>{upvotes === null ? 0 : upvotes}</span>
          <GoArrowDown
            className={`${styles.icon} ${styles.downvote} ${
              typeof voteDirection === 'boolean' &&
              !voteDirection &&
              styles.downvoted
            }`}
            onClick={(event) => {
              event.stopPropagation();
              if (isAuthenticated) {
                dispatch(votePost(id, false));
              }
            }}
          />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.header}>
          <Link
            onClick={(event) => event.stopPropagation()}
            to={`/c/${communityName}`}
            className={styles.community}
          >
            c/{communityName}
          </Link>
          <div className={styles.author}>
            <span>Posted by</span>
            <Link
              onClick={(event) => event.stopPropagation()}
              to={`/u/${userName}`}
              className={styles.author__link}
            >
              u/{userName}
            </Link>
          </div>
          <span className={styles.date}>{moment(createdAt).fromNow()}</span>
        </div>
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
        <div className={styles.footer}>
          <Link
            onClick={(event) => event.stopPropagation()}
            to={`/c/${communityName}/comments/${id}/#comments`}
            className={styles.button}
          >
            <MdChatBubble />
            <span className={styles.comments}>
              {comments === null ? 0 : comments} Comments
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  id: PropTypes.number.isRequired,
  communityName: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  upvotes: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  comments: PropTypes.number,
  voteDirection: PropTypes.bool,
  text: PropTypes.string,
};

export default PostCard;
