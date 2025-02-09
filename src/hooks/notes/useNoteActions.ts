import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../../firebaseConfig'

interface IUseNoteActionsProps {
	noteId?: string
	noteText: string
	noteTitle: string
}

export const useNoteActions = ({ noteId, noteText, noteTitle }: IUseNoteActionsProps) => {
	const navigate = useNavigate()
	const [editNoteMode, setEditNoteMode] = useState<boolean>(false)
	const [editTitleMode, setEditTitleMode] = useState<boolean>(false)

	const onDeleteNote = async () => {
		if (!noteId) return

		try {
			if (confirm('Do you really want to delete this note?')) {
				await deleteDoc(doc(db, 'notes', noteId))
				navigate('/')
			} else return
		} catch (error) {
			console.error('Error deleting note:', error)
		}
	}

	const onUpdateNote = async () => {
		if (!noteId) return

		try {
			const noteRef = doc(db, 'notes', noteId)
			await updateDoc(noteRef, {
				title: noteTitle,
				text: noteText,
			})
			setEditNoteMode(false)
			setEditTitleMode(false)
		} catch (error) {
			console.error('Error updating note:', error)
		}
	}

	return { onDeleteNote, onUpdateNote, editNoteMode, editTitleMode, setEditNoteMode, setEditTitleMode }
}
