import { FC, useEffect, useState } from 'react'
import completeButton from '../../assets/icons/complete-btn.svg'
import deleteButton from '../../assets/icons/delete.svg'
import plusButton from '../../assets/icons/plus.svg'
import Modal from '../../ui/modal/Modal'
import classes from './Habits.module.scss'
import useHabits from './hooks/use-habits'

const HabitsPage: FC = () => {
	const [isHabitModalOpened, setIsHabitModalOpened] = useState(false)
	const [newHabitTitle, setNewHabitTitle] = useState<string>('')

	const { habits, isHabitsLoading, error, addHabit, deleteHabit, resetHabitStatuses, toggleHabitStatus } = useHabits()

	const onSubmitHabit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		addHabit(newHabitTitle)
		setNewHabitTitle('')
		setIsHabitModalOpened(false)
	}

	useEffect(() => {
		const lastReset = localStorage.getItem('lastReset')
		const now = new Date()
		const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)

		if (!lastReset || new Date(Number(lastReset)) < resetTime) {
			if (now >= resetTime) {
				resetHabitStatuses()
			}
		}
	}, [resetHabitStatuses])

	return (
		<>
			<div className={classes.wrapper}>
				<button className={classes.addHabitButton} onClick={() => setIsHabitModalOpened(true)}>
					<img src={plusButton} alt='add new habit' />
				</button>

				<div className={classes.inner}>
					{isHabitsLoading ? (
						<p
							style={{
								fontSize: 30,
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
							}}
						>
							Loading habits...
						</p>
					) : (
						<ul className={classes.habitsList}>
							{habits.length ? (
								habits.map(habit => (
									<li className={classes.habit} key={habit.id}>
										<p className={classes.habitName}>{habit.title}</p>
										{habit.completed ? (
											<button className={classes.completedSpan} onClick={() => toggleHabitStatus(habit.id)}>
												Completed
											</button>
										) : (
											<button className={classes.completeButton} onClick={() => toggleHabitStatus(habit.id)}>
												<img src={completeButton} alt='complete button' />
											</button>
										)}
										<button className={classes.deleteButton} onClick={() => deleteHabit(habit.id)}>
											<img src={deleteButton} alt='delete this habit' />
										</button>
									</li>
								))
							) : (
								<p style={{ fontSize: 30 }}>Create your first habit to track</p>
							)}
						</ul>
					)}
				</div>
			</div>

			{isHabitModalOpened && (
				<Modal setIsHabitModalOpened={setIsHabitModalOpened} isHabitModalOpened={isHabitModalOpened}>
					<div className={classes.modalBody} onClick={e => e.stopPropagation()}>
						<form className={classes.createNewHabitForm} onSubmit={onSubmitHabit}>
							<input
								className={classes.newHabitName}
								type='text'
								placeholder='New habit...'
								value={newHabitTitle}
								onChange={e => setNewHabitTitle(e.target.value)}
								required
								autoFocus
							/>
							{error && <p className={classes.error}>{error}</p>}
							<button className={classes.createButton} type='submit'>
								Create new habit
							</button>
						</form>
					</div>
				</Modal>
			)}
		</>
	)
}

export default HabitsPage
