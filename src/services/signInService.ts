import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig.ts'

const loginUser = async (email: string, password: string): Promise<void> => {
	try {
		await signInWithEmailAndPassword(auth, email, password)
	} catch (error) {
		console.error('Error logging in user:', error)
		throw error
	}
}

export { loginUser }
