import { FC } from 'react'

import classes from './SignupForm.module.scss'

const SignupForm: FC = () => {
	return (
		<form className={classes.form}>
			<label className={classes.label}>
				<span className={classes.span}>Full name</span>
				<input type='text' className={classes.input} placeholder='John' />
			</label>
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
			<button className={classes.button}>Create account</button>
		</form>
	)
}

export default SignupForm
