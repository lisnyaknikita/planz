import { FC } from 'react'

import classes from './Signup.module.scss'
import SignupForm from './components/sign-up-form/SignupForm'

const SignupPage: FC = () => {
	return (
		<div className={classes.inner}>
			<img className={classes.logo} src='/logo.png' alt='logo' />
			<SignupForm />
		</div>
	)
}

export default SignupPage
