import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig'

export const useFetchNote = ({ noteId }: { noteId: string | undefined }) => {
	const [noteText, setNoteText] = useState<string>('')
	const [noteTitle, setNoteTitle] = useState<string>('')
	const [isNoteLoading, setIsNoteLoading] = useState<boolean>(false)

	useEffect(() => {
		const fetchNote = async () => {
			if (noteId) {
				setIsNoteLoading(true)
				try {
					const noteRef = doc(db, 'notes', noteId)
					const noteSnap = await getDoc(noteRef)
					if (noteSnap.exists()) {
						const noteData = noteSnap.data()
						setNoteTitle(noteData.title || '')
						setNoteText(noteData.text || '')
					} else {
						console.error('No such document!')
					}
				} catch (error) {
					console.error('Error fetching note:', error)
				} finally {
					setIsNoteLoading(false)
				}
			} else {
				console.error('No noteId provided')
			}
		}

		fetchNote()
	}, [noteId])

	return { noteText, noteTitle, isNoteLoading, setNoteText, setNoteTitle }
}
