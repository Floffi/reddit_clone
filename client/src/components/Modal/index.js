import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';
import styles from './Modal.module.css';

const Modal = ({ isOpen, close, children }) =>
  isOpen
    ? createPortal(
        <div className={styles.container}>
          <div className={styles.modal}>
            <MdClose className={styles.icon} onClick={close} />
            {children}
          </div>
          <div className={styles.overlay} onClick={close} />
        </div>,
        document.body
      )
    : null;

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  close: PropTypes.func.isRequired,
};

export default Modal;
