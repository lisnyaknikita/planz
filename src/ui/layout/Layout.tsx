import { FC, useState } from 'react'

import classes from './Layout.module.scss'

import editBtn from '../../assets/icons/edit.svg'
import ToggleIcon from '../../assets/icons/nav-toggle.svg'
import quitBtn from '../../assets/icons/quit.svg'
import SettingsIcon from '../../assets/icons/settings.svg'
import testAvatar from '../../assets/icons/test-avatar.png'

import clsx from 'clsx'

import { Route, Routes } from 'react-router-dom'
import { ExtendedUser } from '../../App'
import Navigation from '../../components/navigation/Navigation'
import HabitsPage from '../../pages/habits/Habits'
import NotesPage from '../../pages/notes/Notes'
import NotePage from '../../pages/notes/components/note/Note'
import ProjectsPage from '../../pages/projects/Projects'
import ProjectPage from '../../pages/projects/components/project/Project'
import TimerPage from '../../pages/timer/Timer'
import TimerSettings from '../../pages/timer/components/timer-settings/TimerSettings'
import { logoutUser } from '../../services/logoutService'
import Modal from '../modal/Modal'

interface ILayoutProps {
	user: ExtendedUser
}

const Layout: FC<ILayoutProps> = ({ user }) => {
	const [isNavigationVisible, setIsNavigationVisible] = useState(true)
	const [isSettingsModalOpened, setIsSettingsModalOpened] = useState(false)

	function toggleNavigationVisibility() {
		setIsNavigationVisible(prev => !prev)
	}

	function toggleModalVisibility() {
		setIsSettingsModalOpened(true)
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
				<Route path='/project/:id' element={<ProjectPage />} />
			</Routes>
			<button
				className={clsx(classes.toggleButton, !isNavigationVisible && 'closed')}
				onClick={toggleNavigationVisibility}
			>
				<img src={ToggleIcon} alt='toggle navigation visibility' />
			</button>
			<button
				className={classes.settingsButton}
				onClick={toggleModalVisibility}
			>
				<img src={SettingsIcon} alt='settings' />
			</button>
			{isSettingsModalOpened && (
				<Modal
					setIsSettingsModalOpened={setIsSettingsModalOpened}
					isSettingsModalOpened={isSettingsModalOpened}
				>
					<div className={classes.modalBody} onClick={e => e.stopPropagation()}>
						<button className={classes.quitButton}>
							<img
								src={quitBtn}
								alt='quit button'
								onClick={() => logoutUser()}
							/>
						</button>
						<img className={classes.avatar} src={testAvatar} alt='avatar' />
						<div className={classes.userName}>
							<h6>{user.name}</h6>
							<button className={classes.editBtn}>
								<img src={editBtn} alt='edit button' />
							</button>
						</div>
						<div className={classes.userEmail}>
							<a href='mailto:test@test.ua'>{user.email}</a>
							<button className={classes.editBtn}>
								<img src={editBtn} alt='edit button' />
							</button>
						</div>
						<div className={classes.themeButtons}>
							<button className={classes.themeLightButton}>Light</button>
							<button className={classes.themeDarkButton}>Dark</button>
						</div>
						<a className={classes.projectLink} href='#'>
							Link to project's github
						</a>
					</div>
				</Modal>
			)}
		</div>
	)
}

export default Layout
