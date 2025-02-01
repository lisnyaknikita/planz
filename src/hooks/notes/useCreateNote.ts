import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../../firebaseConfig'

export const useCreateNote = () => {
	const [newNoteTitle, setNewNoteTitle] = useState('')
	const [error, setError] = useState<string>('')
	const [isNotesModalOpened, setIsNotesModalOpened] = useState(false)
	const navigate = useNavigate()

	const toggleModalVisibility = () => setIsNotesModalOpened(prev => !prev)

	const onSubmitNote = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!newNoteTitle.trim()) {
			setError('Title cannot be empty')
			return
		}

		try {
			const newNoteRef = await addDoc(collection(db, 'notes'), {
				title: newNoteTitle,
				text: 'Type something...',
				userId: auth?.currentUser?.uid,
				createdAt: Timestamp.now(),
			})

			navigate(`/note/${newNoteRef.id}`)

			setNewNoteTitle('')
			setError('')
			setIsNotesModalOpened(false)
		} catch (error) {
			setError('Failed to create note')
			console.error('Error creating note:', error)
		}
	}

	return {
		newNoteTitle,
		setNewNoteTitle,
		error,
		isNotesModalOpened,
		setIsNotesModalOpened,
		toggleModalVisibility,
		onSubmitNote,
	}
}
