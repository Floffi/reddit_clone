import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import styles from './Sidebar.module.css';
import { closeSidebar, openCommunity } from '../../redux/modals';
import { FaPlusCircle } from 'react-icons/fa';
import { getCommunities } from '../../redux/communities';

const SidebarItem = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={styles.sidebar__item}
      activeClassName={styles.active__item}
    >
      {children}
    </NavLink>
  );
};

SidebarItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.sidebar);
  const communities = useSelector((state) => state.communities.items);

  useEffect(() => {
    dispatch(getCommunities());
  }, []);

  const openCommunityModal = () => {
    dispatch(openCommunity());
    dispatch(closeSidebar());
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen && styles.sidebar__open}`}>
        <MdClose
          className={styles.close__icon}
          onClick={() => dispatch(closeSidebar())}
        />
        <div className={styles.header}>
          <span className={styles.title}>Communities</span>
          <FaPlusCircle
            className={styles.plus__icon}
            onClick={openCommunityModal}
          />
          <hr className={styles.line} />
        </div>
        <div className={styles.communities}>
          {communities.map((community) => (
            <SidebarItem
              key={community.id}
              id={community.id}
              to={`/c/${community.name.toLowerCase()}`}
            >
              <span>{community.name}</span>
            </SidebarItem>
          ))}
        </div>
      </aside>
      <div
        className={`${styles.overlay} ${isOpen && styles.overlay__visible}`}
        onClick={() => dispatch(closeSidebar())}
      />
    </>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
