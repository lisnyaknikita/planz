import { updateProfile } from 'firebase/auth'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { app, auth } from '../../firebaseConfig.ts'

const firestore = getFirestore(app)

const updateUserName = async (newName: string): Promise<void> => {
	try {
		if (auth.currentUser) {
			await updateProfile(auth.currentUser, { displayName: newName })

			const userDocRef = doc(firestore, 'users', auth.currentUser.uid)
			await updateDoc(userDocRef, { name: newName })
		}
	} catch (error) {
		console.error('Error updating user name:', error)
	}
}

export { updateUserName }
