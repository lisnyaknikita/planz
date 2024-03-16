import { FC, useState } from 'react'

import classes from './Layout.module.scss'

import ToggleIcon from '../../assets/icons/nav-toggle.svg'
import SettingsIcon from '../../assets/icons/settings.svg'

import clsx from 'clsx'

import Navigation from '../../components/navigation/Navigation'

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
			{/* <SomePageComponent/> */}
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
