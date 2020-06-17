import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaEnvelope, FaLock, FaLockOpen } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import styles from './RegisterModal.module.css';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { register } from '../../redux/auth';
import { closeRegister } from '../../redux/modals';
import { inputValidation, formValidation } from '../../utilities/validations';

const RegisterModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.register);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (fn) => (event) => fn(event.target.value);

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const data =
      name === 'confirmPassword' ? { password, confirmPassword: value } : value;
    const { isValid, error } = inputValidation.register(name, data);
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
    const data = { name, email, password, confirmPassword };
    const { isValid, errors } = formValidation.register(data);
    if (!isValid) {
      setErrors(errors);
    } else {
      dispatch(register(data, setErrors, closeModal));
    }
  };

  const closeModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    dispatch(closeRegister());
  };

  return (
    <Modal isOpen={isOpen} close={closeModal}>
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
          label='E-Mail'
          name='email'
          type='text'
          value={email}
          onChange={handleChange(setEmail)}
          onBlur={handleBlur}
          error={errors.email}
        >
          <FaEnvelope />
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
        <Input
          label='Confirm Password'
          name='confirmPassword'
          type='password'
          value={confirmPassword}
          onChange={handleChange(setConfirmPassword)}
          onBlur={handleBlur}
          error={errors.confirmPassword}
        >
          <FaLockOpen />
        </Input>
        <Button type='submit'>Register</Button>
      </form>
    </Modal>
  );
};

RegisterModal.propTypes = {};

export default RegisterModal;
