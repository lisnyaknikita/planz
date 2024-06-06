import { User } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { app } from '../firebaseConfig'
import SignupPage from './pages/sign-up/Signup'
import { observeAuthState } from './services/observer'
import Layout from './ui/layout/Layout'

const firestore = getFirestore(app)

export interface ExtendedUser extends User {
	name: string
}

function App() {
	const [user, setUser] = useState<ExtendedUser | null>(null)

	useEffect(() => {
		const fetchUserData = async (user: User) => {
			const userDoc = await getDoc(doc(firestore, 'users', user.uid))
			if (userDoc.exists()) {
				const userData = userDoc.data()
				setUser({
					...user,
					name: userData?.name,
				} as ExtendedUser)
			}
		}

		const unsubscribe = observeAuthState(async user => {
			if (user) {
				await fetchUserData(user)
			} else {
				setUser(null)
			}
		})

		return () => unsubscribe()
	}, [])

	return (
		<>
			{user ? <Layout user={user} /> : <SignupPage />}

			{/* <SignupPage /> */}
		</>
	)
}

export default App
