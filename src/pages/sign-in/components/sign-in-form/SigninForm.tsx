import { FC } from 'react'

import classes from './SigninForm.module.scss'

const SigninForm: FC = () => {
	return (
		<form className={classes.form}>
			<label className={classes.label}>
				<span className={classes.span}>Email</span>
				<input
					type='email'
					className={classes.input}
					placeholder='john123@gmail.com'
				/>
			</label>
			<label className={classes.label}>
				<span className={classes.span}>Password</span>
				<input type='password' className={classes.input} />
			</label>
			<button className={classes.button}>Log in</button>
		</form>
	)
}

export default SigninForm
