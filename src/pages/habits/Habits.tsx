import { FC, useEffect, useState } from 'react'

import classes from './Habits.module.scss'

import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore'
import { auth, db } from '../../../firebaseConfig'
import completeButton from '../../assets/icons/complete-btn.svg'
import deleteButton from '../../assets/icons/delete.svg'
import plusButton from '../../assets/icons/plus.svg'
import Modal from '../../ui/modal/Modal'
import { Habit } from '../projects/types/types'

const HabitsPage: FC = () => {
	const [habits, setHabits] = useState<Habit[]>([])
	const [isHabitModalOpened, setIsHabitModalOpened] = useState(false)
	const [newHabitTitle, setNewHabitTitle] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [isHabitsLoading, setIsHabitsLoading] = useState<boolean>(false)

	const { currentUser } = auth

	const habitsCollectionRef = collection(db, 'habits')
	const firestore = getFirestore()

	const resetHabitStatuses = async () => {
		try {
			const snapshot = await getDocs(habitsCollectionRef)

			const updates = snapshot.docs.map(async doc => {
				await updateDoc(doc.ref, { completed: false })
			})

			await Promise.all(updates)
			fetchHabits()
			localStorage.setItem('lastReset', Date.now().toString())
		} catch (error) {
			console.error('Error resetting habit statuses: ', error)
		}
	}

	const fetchHabits = async () => {
		setIsHabitsLoading(true)
		try {
			const q = query(habitsCollectionRef, where('userId', '==', currentUser?.uid))
			const data = await getDocs(q)

			const filteredData = data.docs.map(doc => ({
				...(doc.data() as Habit),
				id: doc.id,
			}))
			setHabits(filteredData)
		} catch (error) {
			console.error(error)
		} finally {
			setIsHabitsLoading(false)
		}
	}

	useEffect(() => {
		fetchHabits()
		document.title = 'Planz | Habits'

		const lastReset = localStorage.getItem('lastReset')
		const now = new Date()
		const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)

		if (!lastReset || new Date(Number(lastReset)) < resetTime) {
			if (now >= resetTime) {
				resetHabitStatuses()
			}
		}
	}, [])

	const onSubmitHabit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!newHabitTitle.trim()) {
			setError('Title cannot be empty')
			return
		}

		try {
			await addDoc(collection(db, 'habits'), {
				title: newHabitTitle,
				completed: false,
				userId: auth?.currentUser?.uid,
			})
			setNewHabitTitle('')
			setError('')
			setIsHabitModalOpened(false)
			fetchHabits()
		} catch (error) {
			setError('Failed to create habit')
			console.error('Error creating habit:', error)
		}
	}

	const deleteHabit = async (id: string) => {
		if (confirm('Do you really want to delete this habit?')) {
			try {
				await deleteDoc(doc(firestore, 'habits', id))
				setHabits(habits.filter(habit => habit.id !== id))
			} catch (error) {
				console.error('Error deleting habit: ', error)
			}
		}
	}

	const toggleHabitStatus = async (id: string) => {
		const updatedHabits = habits.map(habit => (habit.id === id ? { ...habit, completed: !habit.completed } : habit))
		setHabits(updatedHabits)
		try {
			await updateDoc(doc(firestore, 'habits', id), {
				completed: !habits.find(habit => habit.id === id)?.completed,
			})
		} catch (error) {
			console.error('Error updating habit: ', error)
		}
	}

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
