import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import styles from './SubmitPost.module.css';
import Button from '../../components/Button';
import { createPost } from '../../redux/posts';
import RichTextEditor from '../../components/RichTextEditor';
import { inputValidation, formValidation } from '../../utilities/validations';

const SubmitPost = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const communities = useSelector((state) => state.communities.items);
  const [selectedOption, setSelectedOption] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});

  const redirect = () => {
    const { pathname } = location;
    const url = pathname.substr(0, pathname.lastIndexOf('/'));
    history.push(url);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { isValid, errors } = formValidation.post({
      selectedOption,
      title,
      text,
    });
    if (!isValid) {
      setErrors(errors);
    } else {
      const data = {
        community_id: selectedOption.value,
        title,
        text,
      };
      dispatch(createPost(data, redirect));
    }
  };

  const options = communities.map((community) => ({
    value: community.id,
    label: community.name,
  }));

  const style = {
    control: (base) => ({
      ...base,
      border: errors.selectedOption
        ? '1px solid var(--red)'
        : '1px solid var(--dark-grey)',
      // This line disable the blue border
      boxShadow: 'none',
    }),
  };

  return (
    <main className={styles.submit__post}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.select__container}>
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={options}
            styles={style}
            placeholder='Select Community'
          />
          <span className={styles.error}>{errors.selectedOption}</span>
        </div>
        <div>
          <div className={styles.title__container}>
            <textarea
              className={`${styles.title} ${
                errors.title && styles.error__border
              }`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
              placeholder='Title'
              maxLength={300}
            />
            <span className={styles.title__length}>{title.length}/300</span>
          </div>
          <span className={styles.error}>{errors.title}</span>
        </div>
        <RichTextEditor
          onChange={setText}
          value={text}
          placeholder='Text (optional)'
        />
        <Button type='submit'>Post</Button>
      </form>
    </main>
  );
};

SubmitPost.propTypes = {};

export default SubmitPost;
