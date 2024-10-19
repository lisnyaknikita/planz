import { FC, useEffect, useState } from 'react'

import clsx from 'clsx'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { auth, db } from '../../../../../firebaseConfig'
import { Note } from '../../../projects/types/types'
import classes from './NotesList.module.scss'

interface INotesListProps {
	isListView: boolean
	isNoteOpened?: boolean
	currentNoteId?: string
}

const NotesList: FC<INotesListProps> = ({ isListView, isNoteOpened, currentNoteId }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [noteList, setNoteList] = useState<Note[]>([])
	const { currentUser } = auth

	const notesCollectionRef = collection(db, 'notes')

	useEffect(() => {
		const getNoteList = async () => {
			setIsLoading(true)
			try {
				const q = query(notesCollectionRef, where('userId', '==', currentUser?.uid))
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

	if (isLoading) {
		return <p style={{ margin: '0 auto' }}>Loading notes...</p>
	}

	return (
		<ul className={clsx(classes.notesList, isListView && 'listView', isNoteOpened && 'noteOpened')}>
			{noteList.length ? (
				noteList.map(note => (
					<li className={clsx(classes.note, note.id === currentNoteId && 'activeNote')} key={note.id}>
						<Link to={`/note/${note.id}`} className={classes.noteLink}>
							<h5 className={classes.noteTitle}>{note.title}</h5>
							<p className={classes.noteText}>{note.text}</p>
						</Link>
					</li>
				))
			) : (
				<p style={{ fontSize: 30 }}>Create your first note</p>
			)}
		</ul>
	)
}

export default NotesList
