import { getAuth } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'

import timerSound from '../assets/timer-sound.mp3'

type TimerContextType = {
	timerRunning: boolean
	timerSeconds: number
	currentPhase: 'flow' | 'break'
	startTimer: () => void
	stopTimer: () => void
	flowDuration: number
	breakDuration: number
	numSessions: number
	completedSessions: number
	updateFlowDuration: (value: number) => void
	updateBreakDuration: (value: number) => void
	updateNumSessions: (value: number) => void
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export const useTimer = () => {
	const context = useContext(TimerContext)
	if (!context) {
		throw new Error('useTimer must be used within a TimerProvider')
	}
	return context
}

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [flowDuration, setFlowDuration] = useState<number>(0)
	const [breakDuration, setBreakDuration] = useState<number>(0)
	const [numSessions, setNumSessions] = useState<number>(4)
	const [completedSessions, setCompletedSessions] = useState<number>(0)

	const [timerRunning, setTimerRunning] = useState<boolean>(false)
	const [timerSeconds, setTimerSeconds] = useState<number>(flowDuration * 60)
	const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
	const [currentPhase, setCurrentPhase] = useState<'flow' | 'break'>('flow')

	const [userId, setUserId] = useState<string | null>(null)
	const firestore = getFirestore()
	const auth = getAuth()

	const workerRef = useRef<Worker | null>(null)

	useEffect(() => {
		workerRef.current = new Worker(
			new URL('../pages/timer/timerWorker.ts', import.meta.url),
			{ type: 'module' }
		)

		workerRef.current.onmessage = e => {
			const { duration, phase, action } = e.data

			if (action === 'complete') {
				const audio = new Audio(timerSound)
				audio.play()

				if (phase === 'flow') {
					setCurrentPhase('break')
					const breakTime = breakDuration * 60
					setTimerSeconds(breakTime)
					workerRef.current?.postMessage({
						action: 'start',
						duration: breakTime,
						phase: 'break',
					})
				} else if (phase === 'break') {
					const newCompletedSessions = completedSessions + 1
					setCompletedSessions(newCompletedSessions)

					if (newCompletedSessions >= numSessions) {
						resetTimer()
					} else {
						setCurrentPhase('flow')
						const flowTime = flowDuration * 60
						setTimerSeconds(flowTime)
						workerRef.current?.postMessage({
							action: 'start',
							duration: flowTime,
							phase: 'flow',
						})
					}
				}
			} else if (duration !== undefined) {
				setTimerSeconds(duration)
				document.title = `${capitalizePhase(phase)}: ${Math.floor(duration / 60)}:${duration % 60 < 10 ? `0${duration % 60}` : duration % 60}`

				function capitalizePhase(phase: 'flow' | 'break'): string {
					return phase.charAt(0).toUpperCase() + phase.slice(1)
				}
			}
		}

		const resetTimer = () => {
			setTimerRunning(false)
			setTimerSeconds(flowDuration * 60)
			setRemainingSeconds(null)
			setCompletedSessions(0)
			setCurrentPhase('flow')
			if (workerRef.current) {
				workerRef.current.postMessage({ action: 'stop' })
			}
		}

		return () => {
			if (workerRef.current) {
				workerRef.current.terminate()
				workerRef.current = null
			}
		}
	}, [completedSessions, flowDuration, breakDuration, numSessions])

	const startWorker = (duration: number, phase: 'flow' | 'break') => {
		if (workerRef.current) {
			workerRef.current.postMessage({
				action: 'start',
				duration: duration,
				phase: phase,
			})
		}
		setTimerRunning(true)
	}
	const startTimer = () => {
		if (timerRunning) return

		setCurrentPhase('flow')
		if (remainingSeconds !== null) {
			startWorker(remainingSeconds, currentPhase)
			setRemainingSeconds(null)
		} else {
			startWorker(flowDuration * 60, 'flow')
		}

		setTimerRunning(true)
	}

	const stopTimer = () => {
		if (workerRef.current) {
			workerRef.current.postMessage({ action: 'stop' })
		}

		setRemainingSeconds(timerSeconds)

		setTimerRunning(false)
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				setUserId(user.uid)
			} else {
				setUserId(null)
			}
		})
		return () => unsubscribe()
	}, [])

	useEffect(() => {
		const fetchTimerSettings = async () => {
			if (userId) {
				try {
					const timerSettingsDocRef = doc(
						firestore,
						'timer-settings',
						`settings-for-${userId}`
					)
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
						setTimerSeconds(flow * 60)
					}
				} catch (error) {
					console.error('Error fetching timer settings:', error)
				}
			}
		}
		fetchTimerSettings()
	}, [userId])

	const updateFlowDuration = (newFlowDuration: number) => {
		setFlowDuration(newFlowDuration)
		setTimerSeconds(newFlowDuration * 60)
	}

	const updateBreakDuration = (newBreakDuration: number) => {
		setBreakDuration(newBreakDuration)
	}

	const updateNumSessions = (newNumSessions: number) => {
		setNumSessions(newNumSessions)
	}

	return (
		<TimerContext.Provider
			value={{
				timerRunning,
				timerSeconds,
				currentPhase,
				startTimer,
				stopTimer,
				flowDuration,
				breakDuration,
				numSessions,
				completedSessions,
				updateFlowDuration,
				updateBreakDuration,
				updateNumSessions,
			}}
		>
			{children}
		</TimerContext.Provider>
	)
}
