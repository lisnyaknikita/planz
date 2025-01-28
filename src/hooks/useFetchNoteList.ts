import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig'
import { Note } from '../pages/projects/types/types'

export const useFetchNoteList = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [noteList, setNoteList] = useState<Note[]>([])
	const { currentUser } = auth

	const notesCollectionRef = collection(db, 'notes')

	useEffect(() => {
		const getNoteList = async () => {
			setIsLoading(true)
			try {
				const q = query(notesCollectionRef, where('userId', '==', currentUser?.uid), orderBy('createdAt', 'asc'))
				const data = await getDocs(q)

				const filteredData = data.docs.map(doc => ({
					...(doc.data() as Note),
					id: doc.id,
				}))
				setNoteList(filteredData)
			} catch (error) {
				console.error(error)
			} finally {
				setIsLoading(false)
			}
		}

		getNoteList()
	}, [currentUser])

	return { noteList, isLoading }
}
