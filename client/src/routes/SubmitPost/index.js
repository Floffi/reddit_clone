import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import styles from './SubmitPost.module.css';
import './SubmitPost.css';
import Button from '../../components/Button';
import { createPost } from '../../redux/posts';

const SubmitPost = (props) => {
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.communities.items);
  const [selectedOption, setSelectedOption] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      community_id: selectedOption.value,
      title,
      text,
    };
    dispatch(createPost(data));
  };

  const options = communities.map((community) => ({
    value: community.id,
    label: community.name,
  }));

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      [{ script: 'sub' }, { script: 'super' }],
      [('link', 'image')],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'script',
    'code-block',
  ];

  const style = {
    control: (base) => ({
      ...base,
      border: '1px solid var(--dark-grey)',
      // This line disable the blue border
      boxShadow: 'none',
    }),
  };

  return (
    <main className={styles.submit__post}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Select
          value={selectedOption}
          onChange={setSelectedOption}
          options={options}
          styles={style}
          placeholder='Select Community'
        />
        <div className={styles.title__container}>
          <textarea
            className={styles.title}
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
        <ReactQuill
          onChange={setText}
          value={text}
          formats={formats}
          modules={modules}
          placeholder='Text (optional)'
        />
        <Button type='submit'>Post</Button>
      </form>
    </main>
  );
};

SubmitPost.propTypes = {};

export default SubmitPost;
