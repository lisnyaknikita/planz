import { FC, useState } from 'react'

import classes from './Layout.module.scss'

import ToggleIcon from '../../assets/icons/nav-toggle.svg'
import SettingsIcon from '../../assets/icons/settings.svg'

import clsx from 'clsx'

import { Route, Routes } from 'react-router-dom'
import Navigation from '../../components/navigation/Navigation'
import HabitsPage from '../../pages/habits/Habits'
import NotesPage from '../../pages/notes/Notes'
import NotePage from '../../pages/notes/components/note/Note'
import ProjectsPage from '../../pages/projects/Projects'
import TimerPage from '../../pages/timer/Timer'
import TimerSettings from '../../pages/timer/components/timer-settings/TimerSettings'

const Layout: FC = () => {
	const [isNavigationVisible, setIsNavigationVisible] = useState(true)

	function toggleNavigationVisibility() {
		setIsNavigationVisible(prev => !prev)
	}

	return (
		<div className={classes.layout}>
			<aside
				className={clsx(classes.sidebar, !isNavigationVisible && 'hidden')}
			>
				<img className={classes.logo} src='/logo.png' alt='logo' />
				<Navigation />
				<img className={classes.brain} src='/brain.svg' alt='brain image' />
			</aside>
			<Routes>
				<Route path='/' element={<NotesPage />} />
				<Route path='/note/:id' element={<NotePage />} />
				<Route path='/habits' element={<HabitsPage />} />
				<Route path='/timer' element={<TimerPage />} />
				<Route path='/timer/settings' element={<TimerSettings />} />
				<Route path='/projects' element={<ProjectsPage />} />
			</Routes>
			<button
				className={clsx(classes.toggleButton, !isNavigationVisible && 'closed')}
				onClick={toggleNavigationVisibility}
			>
				<img src={ToggleIcon} alt='toggle navigation visibility' />
			</button>
			<button className={classes.settingsButton}>
				<img src={SettingsIcon} alt='settings' />
			</button>
		</div>
	)
}

export default Layout
