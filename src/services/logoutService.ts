import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig.ts'

const logoutUser = async (): Promise<void> => {
	try {
		await signOut(auth)
	} catch (error) {
		console.error('Error logging out user:', error)
	}
}

export { logoutUser }
