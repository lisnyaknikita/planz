import { FC } from 'react'

import classes from './Timer.module.scss'

import playButton from '../../assets/icons/play.svg'
// import pauseButton from '../../assets/icons/pause.svg'
import { Link } from 'react-router-dom'
import timerButton from '../../assets/icons/timer.svg'

const TimerPage: FC = () => {
	return (
		<div className={classes.wrapper}>
			<Link to={'/timer/settings'} className={classes.timerSettingsButton}>
				<img src={timerButton} alt='add new project' />
			</Link>
			<div className={classes.inner}>
				<h6 className={classes.timerLabel}>Flow</h6>
				<div className={classes.timer}>90:00</div>
				<ul className={classes.circles}>
					<li className={classes.circle}></li>
					<li className={classes.circle}></li>
					<li className={classes.circle}></li>
				</ul>
				<button className={classes.timerButton}>
					<img src={playButton} alt='play' />
					{/* <img src={pauseButton} alt='play' /> */}
				</button>
			</div>
		</div>
	)
}

export default TimerPage
