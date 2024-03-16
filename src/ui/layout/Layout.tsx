import { FC } from 'react'

import classes from './Layout.module.scss'

import SettingsIcon from '../../assets/icons/settings.svg'

import Navigation from '../../components/navigation/Navigation'

const Layout: FC = () => {
	return (
		<div className={classes.layout}>
			<aside className={classes.sidebar}>
				<img className={classes.logo} src='/logo.png' alt='logo' />
				<Navigation />
				<img className={classes.brain} src='/brain.svg' alt='brain image' />
			</aside>
			{/* <SomePageComponent/> */}
			<button className={classes.toggleButton}>
				{/* <img src={ToggleIcon} alt='toggle navigation visibility' /> */}
			</button>
			<button className={classes.settingsButton}>
				<img src={SettingsIcon} alt='settings' />
			</button>
		</div>
	)
}

export default Layout
