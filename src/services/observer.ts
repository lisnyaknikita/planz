import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebaseConfig.ts'

const observeAuthState = (callback: (user: User | null) => void) => {
	return onAuthStateChanged(auth, callback) // Ensure this returns the unsubscribe function
}

export { observeAuthState }
