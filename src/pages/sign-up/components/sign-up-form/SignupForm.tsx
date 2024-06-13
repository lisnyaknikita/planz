import { FC, useState } from 'react'
import { registerUser } from '../../../../services/signUpService.ts'

import classes from './SignupForm.module.scss'

const SignupForm: FC = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [name, setName] = useState('')
	const [error, setError] = useState<string>('')

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (password.length < 8) {
			setError('Password must be at least 8 characters long')
			return
		}
		try {
			await registerUser(email, password, name)
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<form className={classes.form} onSubmit={handleRegister}>
			<label className={classes.label}>
				<span className={classes.span}>Full name</span>
				<input
					type='text'
					className={classes.input}
					placeholder='John'
					value={name}
					onChange={e => setName(e.target.value)}
					required
				/>
			</label>
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
			{error && <p className={classes.error}>{error}</p>}
			<button className={classes.button} type='submit'>
				Create account
			</button>
		</form>
	)
}

export default SignupForm
