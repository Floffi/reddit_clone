import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styles from './CommentEditor.module.css';
import RichTextEditor from '../RichTextEditor';
import Button from '../Button';
import { createComment } from '../../redux/comments';
import { inputValidation, formValidation } from '../../utilities/validations';

const CommentEditor = ({ postId }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    const { isValid, errors } = formValidation.comment({
      text,
    });
    if (!isValid) {
      setErrors(errors);
    } else {
      dispatch(createComment({ post_id: postId, text }));
    }
  };

  if (isAuthenticated) {
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <RichTextEditor value={text} onChange={setText} placeholder='Text' />
        <div className={styles.footer}>
          <span className={styles.error}>{errors.text}</span>
          <Button type='submit'>Comment</Button>
        </div>
      </form>
    );
  }

  return (
    <div className={styles.auth__message}>
      <span>auth</span>
    </div>
  );
};

CommentEditor.propTypes = {};

export default CommentEditor;
