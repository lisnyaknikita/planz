import { FC } from 'react';

import classes from './Navigation.module.scss';

import { NavLink, useLocation } from 'react-router-dom';

import navHabits from '../../assets/icons/nav-habits.svg';
import navNotes from '../../assets/icons/nav-notes.svg';
import navProjects from '../../assets/icons/nav-projects.svg';
import navTimer from '../../assets/icons/nav-timer.svg';
import clsx from 'clsx';

const Navigation: FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className={classes.navigation}>
      <ul className={classes.navigationList}>
        <li className={classes.navigationItem}>
          <NavLink to='/' className={clsx(classes.navigationLink, isActive('/note') && 'active')}>
            <img className={classes.navigationIcon} src={navNotes} alt='nav icon' />
            <span>Notes</span>
          </NavLink>
        </li>
        <li className={classes.navigationItem}>
          <NavLink to='/habits' className={classes.navigationLink}>
            <img className={classes.navigationIcon} src={navHabits} alt='nav icon' />
            <span>Habits</span>
          </NavLink>
        </li>
        <li className={classes.navigationItem}>
          <NavLink to='/timer' className={classes.navigationLink}>
            <img className={classes.navigationIcon} src={navTimer} alt='nav icon' />
            <span>Timer</span>
          </NavLink>
        </li>
        <li className={classes.navigationItem}>
          <NavLink to='/projects' className={clsx(classes.navigationLink, isActive('/project') && 'active')}>
            <img className={classes.navigationIcon} src={navProjects} alt='nav icon' />
            <span>Projects</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
