import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Home.module.css';
import PostCard from '../../components/PostCard';
import { getCommunityPosts } from '../../redux/posts';
import CreatePost from '../../components/CreatePost';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.community.items);
  const { community } = useParams();

  // Whenever community changes, fetch new posts.
  useEffect(() => {
    dispatch(getCommunityPosts(community));
  }, [community]);

  return (
    <main className={styles.home}>
      <CreatePost community={community} />
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          communityName={post.community_name}
          userName={post.user_name}
          title={post.title}
          text={post.text}
          upvotes={post.upvotes}
          voteDirection={post.vote}
          comments={post.comments}
          createdAt={post.created_at}
        />
      ))}
    </main>
  );
};

Home.propTypes = {};

export default Home;
