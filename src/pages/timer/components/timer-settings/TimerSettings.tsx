import { FC } from 'react'

import classes from './TimerSettings.module.scss'

import { Link } from 'react-router-dom'
import backButton from '../../../../assets/icons/back-btn.svg'

const TimerSettings: FC = () => {
	return (
		<div className={classes.wrapper}>
			<Link to={'/timer'} className={classes.backButton}>
				<img src={backButton} alt='back' />
			</Link>
			<div className={classes.inner}>
				<form className={classes.settingsForm}>
					<label>
						<span className={classes.inputLabel}>Flow duration</span>
						<input className={classes.input} type='text' />
					</label>
					<label>
						<span className={classes.inputLabel}>Break duration</span>
						<input className={classes.input} type='text' />
					</label>
					<label>
						<span className={classes.inputLabel}>Number of sessions</span>
						<input className={classes.input} type='text' />
					</label>
				</form>
			</div>
		</div>
	)
}

export default TimerSettings
