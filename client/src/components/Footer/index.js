import React from 'react';
import PropTypes from 'prop-types';
import styles from './Footer.module.css';

const Footer = (props) => {
  return (
    <footer className={styles.footer}>
      <span>Footer</span>
    </footer>
  );
};

Footer.propTypes = {};

export default Footer;
