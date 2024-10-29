import { FC, useState } from 'react'

import toast from 'react-hot-toast'
import { loginUser } from '../../../../services/signInService'
import classes from './SigninForm.module.scss'

const SigninForm: FC = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [error, setError] = useState<string>('')

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			await loginUser(email, password)
			toast.success('You have successfully logged in!')
		} catch (error) {
			setError('Invalid email or password')
			toast.error('Login error: Please check your email and password.')
		}
	}

	return (
		<form className={classes.form} onSubmit={handleLogin}>
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
				Log in
			</button>
		</form>
	)
}

export default SigninForm
