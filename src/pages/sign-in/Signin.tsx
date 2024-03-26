import { FC } from 'react'

import classes from './Signin.module.scss'
import SigninForm from './components/sign-in-form/SigninForm'

const SigninPage: FC = () => {
	return (
		<div className={classes.inner}>
			<img className={classes.logo} src='/logo.png' alt='logo' />
			<SigninForm />
		</div>
	)
}

export default SigninPage
