import { FC, useEffect, useState } from 'react'

import classes from './Timer.module.scss'

import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import pauseButton from '../../assets/icons/pause.svg'
import playButton from '../../assets/icons/play.svg'
import timerButton from '../../assets/icons/timer.svg'
import timerSound from '../../assets/timer-sound.mp3'

const TimerPage: FC = () => {
	const [flowDuration, setFlowDuration] = useState<number>(0)
	const [breakDuration, setBreakDuration] = useState<number>(0)
	const [numSessions, setNumSessions] = useState<number>(0)
	const [timerRunning, setTimerRunning] = useState<boolean>(false)
	const [timerSeconds, setTimerSeconds] = useState<number>(0)
	const [currentPhase, setCurrentPhase] = useState<'flow' | 'break'>('flow')
	const [completedSessions, setCompletedSessions] = useState<number>(0)

	useEffect(() => {
		const fetchTimerSettings = async () => {
			const db = getFirestore()
			try {
				const timerSettingsDocRef = doc(db, 'timer-settings', 'settings')
				const timerSettingsDoc = await getDoc(timerSettingsDocRef)
				if (timerSettingsDoc.exists()) {
					const {
						flowDuration: flow,
						breakDuration: breakDur,
						numSessions: sessions,
					} = timerSettingsDoc.data() as {
						flowDuration: number
						breakDuration: number
						numSessions: number
					}
					setFlowDuration(flow)
					setBreakDuration(breakDur)
					setNumSessions(sessions)
					setTimerSeconds(flow * 60) // Convert flow duration to seconds
				}
			} catch (error) {
				console.error('Error fetching timer settings:', error)
			}
		}
		fetchTimerSettings()
	}, [])

	const startTimer = () => {
		setTimerRunning(true)
	}

	const stopTimer = () => {
		setTimerRunning(false)
	}

	useEffect(() => {
		let intervalId: NodeJS.Timeout
		if (timerRunning) {
			intervalId = setInterval(() => {
				setTimerSeconds(prevSeconds => {
					if (prevSeconds === 0) {
						togglePhase()
						const audio = new Audio(timerSound)
						audio.play()
						if (completedSessions === numSessions) {
							stopTimer()
						}
						return currentPhase === 'flow'
							? flowDuration * 60
							: breakDuration * 60
					}
					return prevSeconds - 1
				})
			}, 10)
		} else {
			clearInterval(intervalId)
		}
		return () => clearInterval(intervalId)
	}, [
		timerRunning,
		flowDuration,
		breakDuration,
		currentPhase,
		completedSessions,
		numSessions,
	])

	const togglePhase = () => {
		setCurrentPhase(prevPhase => {
			const newPhase = prevPhase === 'flow' ? 'break' : 'flow'
			if (newPhase === 'break') {
				setCompletedSessions(prevSessions => prevSessions + 1)
			}
			return newPhase
		})
	}

	return (
		<div className={classes.wrapper}>
			<Link to={'/timer/settings'} className={classes.timerSettingsButton}>
				<img src={timerButton} alt='add new project' />
			</Link>
			<div className={classes.inner}>
				<h6 className={classes.timerLabel}>
					{currentPhase === 'flow' ? 'Flow' : 'Break'}
				</h6>
				<div className={classes.timer}>
					{Math.floor(timerSeconds / 60)}:
					{timerSeconds % 60 < 10 ? `0${timerSeconds % 60}` : timerSeconds % 60}
				</div>
				<ul className={classes.circles}>
					{Array.from({ length: numSessions }, (_, index) => (
						<li key={index} className={classes.circle}></li>
					))}
				</ul>
				<button
					className={classes.timerButton}
					onClick={timerRunning ? stopTimer : startTimer}
				>
					{timerRunning ? (
						<img src={pauseButton} alt='pause' />
					) : (
						<img src={playButton} alt='play' />
					)}
				</button>
			</div>
		</div>
	)
}

export default TimerPage
