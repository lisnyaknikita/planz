import { doc, getFirestore, setDoc } from 'firebase/firestore'

interface IUseUpdateTimerSettings {
	userId: string | null
	flowDuration: number
	breakDuration: number
	numSessions: number
}

export const useUpdateTimerSettings = ({
	breakDuration,
	flowDuration,
	numSessions,
	userId,
}: IUseUpdateTimerSettings) => {
	const firestore = getFirestore()

	const updateTimerSettings = async () => {
		try {
			if (userId) {
				const timerSettingsDocRef = doc(firestore, 'timer-settings', `settings-for-${userId}`)
				await setDoc(timerSettingsDocRef, {
					flowDuration,
					breakDuration,
					numSessions,
				})
			}
		} catch (error) {
			console.error('Error updating timer settings:', error)
		}
	}

	return { updateTimerSettings }
}
