import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import styles from './CommunityModal.module.css';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { createCommunity } from '../../redux/communities';
import { closeCommunity } from '../../redux/modals';
import { inputValidation, formValidation } from '../../utilities/validations';

const CommunityModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.community);

  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (fn) => (event) => fn(event.target.value);

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const { isValid, error } = inputValidation.community(name, value);
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
    const data = { name };
    const { isValid, errors } = formValidation.community(data);
    if (!isValid) {
      setErrors(errors);
    } else {
      dispatch(createCommunity(data, setErrors, closeModal));
    }
  };

  const closeModal = () => {
    setName('');
    setErrors({});
    dispatch(closeCommunity());
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
        <Button type='submit'>Add Community</Button>
      </form>
    </Modal>
  );
};

CommunityModal.propTypes = {};

export default CommunityModal;
