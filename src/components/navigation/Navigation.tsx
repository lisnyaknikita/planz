import { FC } from 'react'

import classes from './Navigation.module.scss'

import navHabits from '../../assets/icons/nav-habits.svg'
import navNotes from '../../assets/icons/nav-notes.svg'
import navProjects from '../../assets/icons/nav-projects.svg'
import navTimer from '../../assets/icons/nav-timer.svg'

const Navigation: FC = () => {
	return (
		<nav className={classes.navigation}>
			<ul className={classes.navigationList}>
				<li className={classes.navigationItem}>
					<a className={classes.navigationLink} href='#'>
						<img
							className={classes.navigationIcon}
							src={navNotes}
							alt='nav icon'
						/>
						<span>Notes</span>
					</a>
				</li>
				<li className={classes.navigationItem}>
					<a className={classes.navigationLink} href='#'>
						<img
							className={classes.navigationIcon}
							src={navHabits}
							alt='nav icon'
						/>
						<span>Habits</span>
					</a>
				</li>
				<li className={classes.navigationItem}>
					<a className={classes.navigationLink} href='#'>
						<img
							className={classes.navigationIcon}
							src={navTimer}
							alt='nav icon'
						/>
						<span>Timer</span>
					</a>
				</li>
				<li className={classes.navigationItem}>
					<a className={classes.navigationLink} href='#'>
						<img
							className={classes.navigationIcon}
							src={navProjects}
							alt='nav icon'
						/>
						<span>Projects</span>
					</a>
				</li>
			</ul>
		</nav>
	)
}

export default Navigation
