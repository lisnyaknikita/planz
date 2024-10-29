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
	// const [email, setEmail] = useState<string>('')
	// const [password, setPassword] = useState<string>('')
	// const [name, setName] = useState('')
	// const [error, setError] = useState<string>('')

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormValues>({ mode: 'onChange' })

	// const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault()
	// 	if (password.length < 8) {
	// 		setError('Password must be at least 8 characters long')
	// 		return
	// 	}
	// 	try {
	// 		await registerUser(email, password, name)
	// 		toast.success('You have successfully registered! Reload the page')
	// 	} catch (error: any) {
	// 		setError(error.message)
	// 		toast.error('Registration error.')
	// 	}
	// }

	const onSubmit: SubmitHandler<IFormValues> = async data => {
		try {
			await registerUser(data.email, data.password, data.name)
			toast.success('You have successfully registered! Reload the page')
		} catch (error: any) {
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
			{/* {error && <p className={classes.error}>{error}</p>} */}
			<button className={classes.button} type='submit'>
				Create account
			</button>
		</form>
	)
}

export default SignupForm
