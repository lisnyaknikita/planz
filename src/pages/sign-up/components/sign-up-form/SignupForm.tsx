import { FC } from 'react'

import { registerUser } from '../../../../services/signUpService.ts'

import { SubmitHandler, useForm } from 'react-hook-form'

import toast from 'react-hot-toast'

import classes from './SignupForm.module.scss'

interface IFormValues {
	name: string
	email: string
	password: string
}

const SignupForm: FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormValues>({ mode: 'onBlur' })

	const onSubmit: SubmitHandler<IFormValues> = async data => {
		try {
			await registerUser(data.email, data.password, data.name)
			toast.success('You have successfully registered! Reload the page')
		} catch (error) {
			toast.error('Registration error.')
		}
	}

	return (
		<form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
			<label className={classes.label}>
				<span className={classes.span}>Full name</span>
				<input
					type='text'
					className={classes.input}
					placeholder='John'
					{...register('name', {
						required: 'Name is required',
						minLength: {
							value: 3,
							message: 'Name must be at least 3 characters long',
						},
						maxLength: {
							value: 20,
							message: 'Name must be no more than 20 characters long',
						},
					})}
				/>
				{errors.name && <p className={classes.error}>{errors.name.message}</p>}
			</label>
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
						validate: {
							hasLetterAndNumber: value =>
								(/[A-Za-z]/.test(value) && /\d/.test(value)) || 'Password must contain both letters and numbers',
							hasUppercase: value => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
						},
					})}
				/>
				{errors.password && <p className={classes.error}>{errors.password.message}</p>}
			</label>
			<button className={classes.button} type='submit'>
				Create account
			</button>
		</form>
	)
}

export default SignupForm
