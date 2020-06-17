import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = ({
  type,
  name,
  value,
  onChange,
  onBlur,
  label,
  error,
  children,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div
        className={`${styles.container} ${error && styles.container__error}`}
      >
        <div className={styles.icon__container}>{children}</div>
        <div className={styles.input__container}>
          <input
            id={label}
            type={showPassword ? 'text' : type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={styles.input}
            placeholder=' '
          />
          <label htmlFor={label} className={styles.label}>
            {label}
          </label>
        </div>
        {type === 'password' &&
          (showPassword ? (
            <FaEye
              className={styles.icon}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaEyeSlash
              className={styles.icon}
              onClick={() => setShowPassword(true)}
            />
          ))}
      </div>
      <span className={styles.error}>{error}</span>
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  error: PropTypes.string,
};

export default Input;
