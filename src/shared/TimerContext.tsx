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

// Типы данных для контекста
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
	// Состояния для длительности фаз и количества сессий
	const [flowDuration, setFlowDuration] = useState<number>(0) // В минутах
	const [breakDuration, setBreakDuration] = useState<number>(0) // В минутах
	const [numSessions, setNumSessions] = useState<number>(4) // Количество сессий
	const [completedSessions, setCompletedSessions] = useState<number>(0)

	// Состояния таймера
	const [timerRunning, setTimerRunning] = useState<boolean>(false)
	const [timerSeconds, setTimerSeconds] = useState<number>(flowDuration * 60)
	const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null) // Изначально 25 минут
	const [currentPhase, setCurrentPhase] = useState<'flow' | 'break'>('flow')

	// Firebase auth and firestore
	const [userId, setUserId] = useState<string | null>(null)
	const firestore = getFirestore()
	const auth = getAuth()

	const workerRef = useRef<Worker | null>(null)

	// Инициализация веб-воркера
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
					// Переключаемся на фазу перерыва
					setCurrentPhase('break')
					const breakTime = breakDuration * 60
					setTimerSeconds(breakTime)
					workerRef.current?.postMessage({
						action: 'start',
						duration: breakTime,
						phase: 'break',
					})
				} else if (phase === 'break') {
					// Завершился перерыв, увеличиваем счетчик завершённых сессий
					const newCompletedSessions = completedSessions + 1
					setCompletedSessions(newCompletedSessions)

					if (newCompletedSessions >= numSessions) {
						// Все сессии завершены, сбрасываем таймер
						resetTimer() // Вызов функции сброса
					} else {
						// Если ещё не все сессии завершены, возвращаемся к фазе flow
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
			setTimerSeconds(flowDuration * 60) // Установим таймер на начало flow
			setRemainingSeconds(null)
			setCompletedSessions(0) // Сбросим количество завершённых сессий
			setCurrentPhase('flow') // Вернёмся к фазе flow
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

	// Функция для запуска веб-воркера
	const startWorker = (duration: number, phase: 'flow' | 'break') => {
		if (workerRef.current) {
			workerRef.current.postMessage({
				action: 'start',
				duration: duration,
				phase: phase, // Передаем текущую фазу (flow или break)
			})
		}
		setTimerRunning(true)
	}
	const startTimer = () => {
		// Если таймер уже запущен, ничего не делаем
		if (timerRunning) return

		setCurrentPhase('flow')
		if (remainingSeconds !== null) {
			// Если таймер был приостановлен, продолжаем с того места
			startWorker(remainingSeconds, currentPhase)
			setRemainingSeconds(null) // Сбрасываем оставшееся время
		} else {
			// Если это первый запуск таймера, начинаем с полного времени
			startWorker(flowDuration * 60, 'flow')
		}

		// Устанавливаем состояние таймера в true
		setTimerRunning(true)
	}

	const stopTimer = () => {
		if (workerRef.current) {
			workerRef.current.postMessage({ action: 'stop' })
		}

		// Сохраняем текущее оставшееся время
		setRemainingSeconds(timerSeconds)

		// Устанавливаем состояние таймера в false (для кнопки)
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

	// Эффект для загрузки настроек таймера из Firebase
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
						// Устанавливаем загруженные данные в состояние
						setFlowDuration(flow)
						setBreakDuration(breakDur)
						setNumSessions(sessions)
						setTimerSeconds(flow * 60) // Переводим flowDuration в секунды
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
		setTimerSeconds(newFlowDuration * 60) // Обновляем оставшееся время
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
