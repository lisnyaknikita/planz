import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { app, auth } from '../../firebaseConfig.ts'

const firestore = getFirestore(app)

const registerUser = async (
	email: string,
	password: string,
	name: string
): Promise<void> => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		)

		const user = userCredential.user

		await updateProfile(user, {
			displayName: name,
		})

		await setDoc(doc(firestore, 'users', user.uid), {
			name,
			email,
		})
	} catch (error) {
		console.error('Error registering user:', error)
	}
}

export { registerUser }
