import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './CreatePost.module.css';

const CreatePost = ({ community }) => {
  const path = community ? `/c/${community}/submit` : '/submit';

  return (
    <Link className={styles.create__post} to={path}>
      <input className={styles.input} placeholder='Create Post' />
    </Link>
  );
};

CreatePost.propTypes = {
  community: PropTypes.string,
};

export default CreatePost;
