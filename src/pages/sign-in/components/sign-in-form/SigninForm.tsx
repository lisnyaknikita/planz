import { FC, useState } from 'react'

import { loginUser } from '../../../../services/signInService'
import classes from './SigninForm.module.scss'

const SigninForm: FC = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		await loginUser(email, password)
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
			<button className={classes.button} type='submit'>
				Log in
			</button>
		</form>
	)
}

export default SigninForm
