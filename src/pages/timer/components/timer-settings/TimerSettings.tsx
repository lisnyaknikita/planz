import { FC, useEffect, useState } from 'react'

import { getAuth } from 'firebase/auth'
import { Link } from 'react-router-dom'
import backButton from '../../../../assets/icons/back-btn.svg'
import { useUpdateTimerSettings } from '../../../../hooks/timer/useUpdateTimerSettings'
import { useTimer } from '../../../../shared/TimerContext'
import classes from './TimerSettings.module.scss'

const TimerSettings: FC = () => {
	const { flowDuration, breakDuration, numSessions, updateFlowDuration, updateBreakDuration, updateNumSessions } =
		useTimer()

	const [userId, setUserId] = useState<string | null>(null)
	const { updateTimerSettings } = useUpdateTimerSettings({ userId, breakDuration, flowDuration, numSessions })

	useEffect(() => {
		const auth = getAuth()
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				setUserId(user.uid)
			} else {
				setUserId(null)
			}
		})
		document.title = 'Planz | Timer settings'
		return () => unsubscribe()
	}, [])

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
							onChange={e => updateFlowDuration(parseInt(e.target.value))}
						/>
					</label>
					<label>
						<span className={classes.inputLabel}>Break duration</span>
						<input
							className={classes.input}
							type='number'
							value={breakDuration}
							onChange={e => updateBreakDuration(parseInt(e.target.value))}
						/>
					</label>
					<label>
						<span className={classes.inputLabel}>Number of sessions</span>
						<input
							className={classes.input}
							type='number'
							value={numSessions}
							onChange={e => updateNumSessions(parseInt(e.target.value))}
						/>
					</label>
				</form>
			</div>
		</div>
	)
}

export default TimerSettings
