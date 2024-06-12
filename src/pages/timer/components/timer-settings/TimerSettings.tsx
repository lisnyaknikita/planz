import { FC, useEffect, useState } from 'react'

import classes from './TimerSettings.module.scss'

import {
	collection,
	doc,
	getDocs,
	getFirestore,
	setDoc,
} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import backButton from '../../../../assets/icons/back-btn.svg'

const TimerSettings: FC = () => {
	const [flowDuration, setFlowDuration] = useState<number>(0)
	const [breakDuration, setBreakDuration] = useState<number>(0)
	const [numSessions, setNumSessions] = useState<number>(0)

	const firestore = getFirestore()

	useEffect(() => {
		const fetchTimerSettings = async () => {
			try {
				const timerSettingsCollectionRef = collection(
					firestore,
					'timer-settings'
				)
				const timerSettingsSnapshot = await getDocs(timerSettingsCollectionRef)
				const timerSettingsData = timerSettingsSnapshot.docs[0].data()
				setFlowDuration(timerSettingsData.flowDuration)
				setBreakDuration(timerSettingsData.breakDuration)
				setNumSessions(timerSettingsData.numSessions)
			} catch (error) {
				console.error(
					'Something went wrong while fetching timer settings:',
					error
				)
			}
		}

		fetchTimerSettings()
	}, [])

	const updateTimerSettings = async () => {
		try {
			const timerSettingsDocRef = doc(firestore, 'timer-settings', 'settings')
			await setDoc(timerSettingsDocRef, {
				flowDuration,
				breakDuration,
				numSessions,
			})
			console.log('Timer settings updated successfully')
		} catch (error) {
			console.error('Error updating timer settings:', error)
		}
	}

	return (
		<div className={classes.wrapper}>
			<Link to={'/timer'} className={classes.backButton}>
				<img src={backButton} alt='back' />
			</Link>
			<div className={classes.inner}>
				<form className={classes.settingsForm} onBlur={updateTimerSettings}>
					<label>
						<span className={classes.inputLabel}>Flow duration</span>
						<input
							className={classes.input}
							type='number'
							value={flowDuration}
							onChange={e => setFlowDuration(parseInt(e.target.value))}
						/>
					</label>
					<label>
						<span className={classes.inputLabel}>Break duration</span>
						<input
							className={classes.input}
							type='number'
							value={breakDuration}
							onChange={e => setBreakDuration(parseInt(e.target.value))}
						/>
					</label>
					<label>
						<span className={classes.inputLabel}>Number of sessions</span>
						<input
							className={classes.input}
							type='number'
							value={numSessions}
							onChange={e => setNumSessions(parseInt(e.target.value))}
						/>
					</label>
				</form>
			</div>
		</div>
	)
}

export default TimerSettings
