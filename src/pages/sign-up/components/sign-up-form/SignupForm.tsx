import { FC, useState } from 'react'
import { registerUser } from '../../../../services/signUpService.ts'

import classes from './SignupForm.module.scss'

const SignupForm: FC = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		await registerUser(email, password)
	}

	return (
		<form className={classes.form} onSubmit={handleRegister}>
			{/* <label className={classes.label}>
				<span className={classes.span}>Full name</span>
				<input type='text' className={classes.input} placeholder='John' />
			</label> */}
			<label className={classes.label}>
				<span className={classes.span}>Email</span>
				<input
					type='email'
					className={classes.input}
					placeholder='john123@gmail.com'
					value={email}
					onChange={e => setEmail(e.target.value)}
					required
				/>
			</label>
			<label className={classes.label}>
				<span className={classes.span}>Password</span>
				<input
					type='password'
					className={classes.input}
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
			</label>
			<button className={classes.button} type='submit'>
				Create account
			</button>
		</form>
	)
}

export default SignupForm
