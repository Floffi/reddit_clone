import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import styles from './LoginModal.module.css';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { login } from '../../redux/auth';
import { closeLogin } from '../../redux/modals';
import { inputValidation, formValidation } from '../../utilities/validations';

const LoginModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.login);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (fn) => (event) => fn(event.target.value);

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const { isValid, error } = inputValidation.login(name, value);
    if (!isValid) {
      setErrors((prevErr) => ({
        ...prevErr,
        [name]: error,
      }));
    } else {
      if (errors[name]) {
        setErrors((prevErr) => {
          const { [name]: omit, ...rest } = prevErr;
          return rest;
        });
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { name, password };
    const { isValid, errors } = formValidation.login(data);
    if (!isValid) {
      setErrors(errors);
    } else {
      dispatch(login(data, setErrors, closeModal));
    }
  };

  const closeModal = () => {
    setName('');
    setPassword('');
    setErrors({});
    dispatch(closeLogin());
  };

  return (
    <Modal isOpen={isOpen} close={closeModal}>
      {errors.general && <span className={styles.error}>{errors.general}</span>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label='Name'
          name='name'
          type='text'
          value={name}
          onChange={handleChange(setName)}
          onBlur={handleBlur}
          error={errors.name}
        >
          <FaUser />
        </Input>
        <Input
          label='Password'
          name='password'
          type='password'
          value={password}
          onChange={handleChange(setPassword)}
          onBlur={handleBlur}
          error={errors.password}
        >
          <FaLock />
        </Input>
        <Button type='submit'>Login</Button>
      </form>
    </Modal>
  );
};

LoginModal.propTypes = {};

export default LoginModal;
