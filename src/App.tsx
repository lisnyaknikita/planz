import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import SigninPage from './pages/sign-in/Signin'
import { observeAuthState } from './services/observer'
import Layout from './ui/layout/Layout'

function App() {
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		observeAuthState(user => {
			setUser(user)
		})
	}, [])

	return (
		<>
			{user ? <Layout /> : <SigninPage />}
			{/* <Layout /> */}

			{/* <SignupPage /> */}
		</>
	)
}

export default App
