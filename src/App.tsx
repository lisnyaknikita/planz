import { User } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { app } from '../firebaseConfig'

import { useEffect, useState } from 'react'

import SigninPage from './pages/sign-in/Signin'
import SignupPage from './pages/sign-up/Signup'

import { observeAuthState } from './services/observer'

import Layout from './ui/layout/Layout'

const firestore = getFirestore(app)

export interface ExtendedUser extends User {
	name: string
}

function App() {
	const [user, setUser] = useState<ExtendedUser | null>(null)
	const [isLogin, setIsLogin] = useState<boolean>(false)
	const [loading, setLoading] = useState(true)

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
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	const toggleAuthMode = () => {
		setIsLogin(!isLogin)
	}

	if (loading) {
		return <div className='loader'>Loading...</div>
	}

	return (
		<>
			{user ? (
				<Layout user={user} />
			) : isLogin ? (
				<SigninPage toggleAuthMode={toggleAuthMode} />
			) : (
				<SignupPage toggleAuthMode={toggleAuthMode} />
			)}
		</>
	)
}

export default App
