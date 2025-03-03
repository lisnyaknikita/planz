import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getAuth } from 'firebase/auth'

import pauseButton from '../../assets/icons/pause.svg'
import playButton from '../../assets/icons/play.svg'
import timerButton from '../../assets/icons/timer.svg'

import { useTimer } from '../../shared/TimerContext'

import { formatTime } from '../../utilities/formatTime'

import classes from './Timer.module.scss'

const TimerPage: FC = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_userId, setUserId] = useState<string | null>(null)
	const { timerRunning, timerSeconds, currentPhase, numSessions, completedSessions, startTimer, stopTimer, isLoading } =
		useTimer()
	const auth = getAuth()

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				setUserId(user.uid)
			} else {
				setUserId(null)
			}
		})
		document.title = 'Planz | Timer'
		return () => unsubscribe()
	}, [auth])

	return (
		<div className={classes.wrapper}>
			<Link to={'/timer/settings'} className={classes.timerSettingsButton}>
				<img src={timerButton} alt='Настройки таймера' />
			</Link>
			<div className={classes.inner}>
				{isLoading ? (
					<p style={{ fontSize: 30 }}>Loading...</p>
				) : (
					<>
						<h6 className={classes.timerLabel}>{currentPhase === 'flow' ? 'Flow' : 'Break'}</h6>
						<div className={classes.timer}>{formatTime(timerSeconds)}</div>
						<ul className={classes.circles}>
							{Array.from({ length: numSessions }, (_, index) => (
								<li key={index} className={`${classes.circle} ${index < completedSessions ? 'completed' : ''}`}></li>
							))}
						</ul>
						<button className={classes.timerButton} onClick={timerRunning ? stopTimer : startTimer}>
							<img src={timerRunning ? pauseButton : playButton} alt={timerRunning ? 'Пауза' : 'Старт'} />
						</button>
					</>
				)}
			</div>
		</div>
	)
}

export default TimerPage
