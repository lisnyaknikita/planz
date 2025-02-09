import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import toast from 'react-hot-toast'

import { loginUser } from '../../../../services/signInService'

import classes from './SigninForm.module.scss'

interface IFormValues {
	name: string
	email: string
	password: string
}

const SigninForm: FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormValues>({ mode: 'onBlur' })

	const onSubmit: SubmitHandler<IFormValues> = async data => {
		try {
			await loginUser(data.email, data.password)
			toast.success('You have successfully logged in!')
		} catch (error) {
			toast.error('Login error: Please check your email and password.')
		}
	}

	return (
		<form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
			<label className={classes.label}>
				<span className={classes.span}>Email</span>
				<input
					type='email'
					className={classes.input}
					placeholder='john123@gmail.com'
					{...register('email', {
						required: 'Email is required',
						pattern: {
							value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
							message: 'Invalid email address',
						},
					})}
				/>
				{errors.email && <p className={classes.error}>{errors.email.message}</p>}
			</label>
			<label className={classes.label}>
				<span className={classes.span}>Password</span>
				<input
					type='password'
					className={classes.input}
					placeholder='Your password'
					{...register('password', {
						required: 'Password is required',
						minLength: {
							value: 8,
							message: 'Password must be at least 8 characters long',
						},
					})}
				/>
				{errors.password && <p className={classes.error}>{errors.password.message}</p>}
			</label>
			<button className={classes.button} type='submit'>
				Log in
			</button>
		</form>
	)
}

export default SigninForm
