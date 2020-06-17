import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaReddit, FaBars } from 'react-icons/fa';
import styles from './Header.module.css';
import Button from '../Button';
import { openSidebar, openRegister, openLogin } from '../../redux/modals';
import { logout } from '../../redux/auth';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isFetching } = useSelector((state) => state.auth);

  const nav = isAuthenticated ? (
    <Button onClick={() => dispatch(logout())}>Logout</Button>
  ) : (
    <>
      <Button onClick={() => dispatch(openLogin())}>Log In</Button>
      <Button onClick={() => dispatch(openRegister())}>Sign Up</Button>
    </>
  );

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <FaBars
          className={styles.icon}
          onClick={() => dispatch(openSidebar())}
        />
        <Link to='/' className={styles.logo__link}>
          <FaReddit />
        </Link>
      </div>
      <nav className={styles.nav}>{!isFetching && nav}</nav>
    </header>
  );
};

Header.propTypes = {};

export default Header;
