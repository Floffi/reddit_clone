import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styles from './CommentEditor.module.css';
import RichTextEditor from '../RichTextEditor';
import Button from '../Button';
import { createComment } from '../../redux/comments';

const CommentEditor = ({ postId }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(createComment({ post_id: postId, text }));
  };

  if (isAuthenticated) {
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <RichTextEditor value={text} onChange={setText} placeholder='Text' />
        <Button type='submit'>Comment</Button>
      </form>
    );
  }

  return (
    <div className={styles.auth__message}>
      <span>auth</span>
    </div>
  );
};

CommentEditor.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default CommentEditor;
