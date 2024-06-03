import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig.ts'

const registerUser = async (email: string, password: string): Promise<void> => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		)
		const user = userCredential.user
		console.log('User registered:', user)
		// Дополнительные действия после регистрации пользователя
	} catch (error) {
		console.error('Error registering user:', error)
	}
}

export { registerUser }
