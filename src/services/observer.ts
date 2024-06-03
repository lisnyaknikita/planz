import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebaseConfig.ts'

const observeAuthState = (callback: (user: User | null) => void): void => {
	onAuthStateChanged(auth, user => {
		callback(user)
	})
}

export { observeAuthState }
