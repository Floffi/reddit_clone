import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Post.module.css';
import { getPost } from '../../redux/posts';
import comments, { getPostComments } from '../../redux/comments';
import PostCard from '../../components/PostCard';
import CommentEditor from '../../components/CommentEditor';
import Comment from '../../components/Comment';
import nestComments from '../../utilities/nestComments';

const Post = (props) => {
  const dispatch = useDispatch();
  const { community, post_id } = useParams();
  const { isFetching: isFetchingPost, item: postItem } = useSelector(
    (state) => state.posts.discussion
  );
  const { isFetching: isFetchingComments, items: commentItems } = useSelector(
    (state) => state.comments.post
  );

  useEffect(() => {
    dispatch(getPost(post_id));
    dispatch(getPostComments(post_id));
  }, [post_id]);

  if (isFetchingPost || isFetchingComments || !postItem || !commentItems) {
    return <span>Loading</span>;
  }

  return (
    <main className={styles.post}>
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
      />
      <CommentEditor postId={post_id} />
      <div className={styles.comments}>
        {nestComments(commentItems).map((comment) => (
          <Comment
            id={comment.id}
            user={comment.user_name}
            upvotes={comment.upvotes}
            text={comment.text}
            createdAt={comment.created_at}
            children={comment.children}
          />
        ))}
      </div>
    </main>
  );
};

Post.propTypes = {};

export default Post;
