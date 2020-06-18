import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';

const RichTextEditor = ({ onChange, value, placeholder }) => {
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

  return (
    <ReactQuill
      onChange={onChange}
      value={value}
      formats={formats}
      modules={modules}
      placeholder={placeholder}
    />
  );
};

RichTextEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

export default RichTextEditor;
