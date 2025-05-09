import { ChangeEvent, FC, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'

import editBtn from '../../assets/icons/edit.svg'
import ToggleIcon from '../../assets/icons/nav-toggle.svg'
import quitBtn from '../../assets/icons/quit.svg'
import SettingsIcon from '../../assets/icons/settings.svg'

import clsx from 'clsx'

import { ExtendedUser } from '../../App'

import Navigation from '../../components/navigation/Navigation'

import { useUserAvatar } from '../../hooks/useUserAvatar'

import HabitsPage from '../../pages/habits/Habits'
import NotesPage from '../../pages/notes/Notes'
import NotePage from '../../pages/notes/components/note/Note'
import ProjectsPage from '../../pages/projects/Projects'
import ProjectPage from '../../pages/projects/components/project/Project'
import TimerPage from '../../pages/timer/Timer'
import TimerSettings from '../../pages/timer/components/timer-settings/TimerSettings'

import { logoutUser } from '../../services/logoutService'
import { updateUserName } from '../../services/updateUserInfoService'
import { uploadAvatar } from '../../services/uploadAvatarService'

import { TimerProvider } from '../../shared/TimerContext'

import Modal from '../modal/Modal'

import classes from './Layout.module.scss'

interface ILayoutProps {
	user: ExtendedUser
}

const Layout: FC<ILayoutProps> = ({ user }) => {
	const [isNavigationVisible, setIsNavigationVisible] = useState(true)
	const [isSettingsModalOpened, setIsSettingsModalOpened] = useState(false)
	const [isEditingName, setIsEditingName] = useState(false)
	const [newName, setNewName] = useState(user.name)

	const { avatar, setAvatar } = useUserAvatar()

	const navigate = useNavigate()

	function toggleNavigationVisibility() {
		setIsNavigationVisible(prev => !prev)
	}

	function toggleModalVisibility() {
		setIsSettingsModalOpened(true)
	}

	const handleNameChange = async () => {
		if (newName !== user.name) {
			await updateUserName(newName)
		}

		setIsEditingName(false)
	}

	const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, type: 'name' | 'email') => {
		if (event.key === 'Enter') {
			if (type === 'name') {
				await handleNameChange()
			}
		}
	}

	const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0]
			const photoURL = await uploadAvatar(file)
			setAvatar(photoURL)
		}
	}

	return (
		<div className={classes.layout}>
			<aside className={clsx(classes.sidebar, !isNavigationVisible && 'hidden')}>
				<Link to={'/'} className={classes.logo}>
					<img src='/logo.png' alt='logo' />
				</Link>
				<Navigation />
				<img className={classes.brain} src='/brain.svg' alt='brain image' />
			</aside>
			<TimerProvider>
				<Routes>
					<Route path='/' element={<NotesPage />} />
					<Route path='/note/:noteId' element={<NotePage />} />
					<Route path='/habits' element={<HabitsPage />} />
					<Route path='/timer' element={<TimerPage />} />
					<Route path='/timer/settings' element={<TimerSettings />} />
					<Route path='/projects' element={<ProjectsPage />} />
					<Route path='/project/:id' element={<ProjectPage />} />
				</Routes>
			</TimerProvider>
			<button
				className={clsx(classes.toggleButton, !isNavigationVisible && 'closed')}
				onClick={toggleNavigationVisibility}
			>
				<img src={ToggleIcon} alt='toggle navigation visibility' />
			</button>
			<button className={classes.settingsButton} onClick={toggleModalVisibility}>
				<img src={SettingsIcon} alt='settings' />
			</button>
			{isSettingsModalOpened && (
				<Modal setIsSettingsModalOpened={setIsSettingsModalOpened} isSettingsModalOpened={isSettingsModalOpened}>
					<div className={classes.modalBody} onClick={e => e.stopPropagation()}>
						<button className={classes.quitButton}>
							<img
								src={quitBtn}
								alt='quit button'
								onClick={() => {
									logoutUser()
									navigate('/')
								}}
							/>
						</button>
						<div className={classes.avatarContainer}>
							<img className={classes.avatar} src={avatar} alt='avatar' />
							<input type='file' accept='image/*' onChange={handleAvatarChange} className={classes.uploadInput} />
						</div>
						<div className={classes.userName}>
							{isEditingName ? (
								<input
									className={classes.userNameInput}
									type='text'
									value={newName}
									onChange={e => setNewName(e.target.value)}
									onBlur={handleNameChange}
									onKeyDown={e => handleKeyPress(e, 'name')}
									autoFocus
								/>
							) : (
								<>
									<h6>{user.name}</h6>
									<button className={classes.editBtn} onClick={() => setIsEditingName(true)}>
										<img src={editBtn} alt='edit button' />
									</button>
								</>
							)}
						</div>
						<div className={classes.userEmail}>
							<a href={`mailto:${user.email}`}>{user.email}</a>
						</div>
						<div className={classes.themeButtons}>
							<button className={classes.themeLightButton}>Light</button>
							<button className={classes.themeDarkButton}>Dark</button>
						</div>
						<a className={classes.projectLink} href='https://github.com/lisnyaknikita/planz' target='_blank'>
							Link to project's github
						</a>
					</div>
				</Modal>
			)}
		</div>
	)
}

export default Layout
