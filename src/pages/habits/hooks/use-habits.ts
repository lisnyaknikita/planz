import {
	Timestamp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../../../../firebaseConfig'
import { Habit } from '../../projects/types/types'

const habitsCollectionRef = collection(db, 'habits')

const useHabits = () => {
	const [habits, setHabits] = useState<Habit[]>([])
	const [isHabitsLoading, setIsHabitsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')

	const { currentUser } = auth
	const firestore = db

	const fetchHabits = async () => {
		setIsHabitsLoading(true)
		try {
			const q = query(
				habitsCollectionRef,
				where('userId', '==', currentUser?.uid),
				orderBy('createdAt', 'asc'),
				orderBy('completed')
			)
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

	const addHabit = async (newHabitTitle: string) => {
		if (!newHabitTitle.trim()) {
			setError('Title cannot be empty')
			return
		}

		try {
			await addDoc(collection(db, 'habits'), {
				title: newHabitTitle,
				completed: false,
				userId: auth?.currentUser?.uid,
				createdAt: Timestamp.now(),
			})
			setError('')
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
				setError('Failed to delete habit')
			}
		}
	}

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
			setError('Failed to reset habits')
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
			setError('Failed to update habit')
		}
	}

	useEffect(() => {
		fetchHabits()
	}, [])

	return {
		habits,
		isHabitsLoading,
		error,
		addHabit,
		deleteHabit,
		resetHabitStatuses,
		toggleHabitStatus,
	}
}

export default useHabits
