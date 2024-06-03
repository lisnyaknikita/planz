import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig.ts'

const loginUser = async (email: string, password: string): Promise<void> => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		)
		const user = userCredential.user
		console.log('User logged in:', user)
		// Дополнительные действия после входа пользователя
	} catch (error) {
		console.error('Error logging in user:', error)
	}
}

export { loginUser }
