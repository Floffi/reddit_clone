import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Post.module.css';
import { getPost } from '../../redux/posts';
import { getPostComments } from '../../redux/comments';
import PostCard from '../../components/PostCard';
import CommentEditor from '../../components/CommentEditor';
import Comment from '../../components/Comment';
import nestComments from '../../utilities/nestComments';

const Post = () => {
  const dispatch = useDispatch();
  const { hash } = useLocation();
  const { community, post_id } = useParams();
  const { isFetching: isFetchingPost, item: postItem } = useSelector(
    (state) => state.posts.discussion
  );
  const { isFetching: isFetchingComments, items: commentItems } = useSelector(
    (state) => state.comments.post
  );
  const commentsRef = useRef(null);

  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop - 70);

  useEffect(() => {
    dispatch(getPost(post_id));
    dispatch(getPostComments(post_id));
  }, [post_id]);

  useEffect(() => {
    if (hash === '#comments' && commentsRef.current) {
      scrollToRef(commentsRef);
    }
  }, [hash]);

  if (isFetchingPost || isFetchingComments || !postItem || !commentItems) {
    return <span>Loading</span>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.post}>
        <PostCard
          id={postItem.id}
          communityName={postItem.community_name}
          userName={postItem.user_name}
          title={postItem.title}
          text={postItem.text}
          upvotes={postItem.upvotes}
          voteDirection={postItem.vote}
          comments={postItem.comments}
          createdAt={postItem.created_at}
          mode={false}
        />
        <CommentEditor postId={post_id} />
        <div className={styles.comments} ref={commentsRef}>
          {nestComments(commentItems).map((comment) => (
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
          ))}
        </div>
      </div>
    </main>
  );
};

Post.propTypes = {};

export default Post;
