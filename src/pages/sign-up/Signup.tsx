import { FC } from 'react'

import classes from './Signup.module.scss'

import SignupForm from './components/sign-up-form/SignupForm'

interface ISignupPageProps {
	toggleAuthMode: () => void
}

const SignupPage: FC<ISignupPageProps> = ({ toggleAuthMode }) => {
	return (
		<div className={classes.inner}>
			<img className={classes.logo} src='/logo.png' alt='logo' />
			<SignupForm />
			{/* <button onClick={signInWithGoogle}>
				<img src={googleIcon} alt='' />
			</button> */}
			<button className={classes.alreadyButton} onClick={toggleAuthMode}>
				Already have an account? Login
			</button>
		</div>
	)
}

export default SignupPage
