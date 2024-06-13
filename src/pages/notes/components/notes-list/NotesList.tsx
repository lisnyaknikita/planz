import { FC, useEffect, useState } from 'react'

import clsx from 'clsx'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { auth, db } from '../../../../../firebaseConfig'
import classes from './NotesList.module.scss'

interface INotesListProps {
	isListView: boolean
	isNoteOpened?: boolean
}

const NotesList: FC<INotesListProps> = ({ isListView, isNoteOpened }) => {
	const [noteList, setNoteList] = useState([])
	const { currentUser } = auth

	const notesCollectionRef = collection(db, 'notes')

	useEffect(() => {
		const getNoteList = async () => {
			try {
				const q = query(
					notesCollectionRef,
					where('userId', '==', currentUser?.uid)
				)
				const data = await getDocs(q)

				const filteredData = data.docs.map(doc => ({
					...doc.data(),
					id: doc.id,
				}))
				setNoteList(filteredData)
			} catch (error) {
				console.error(error)
			}
		}

		getNoteList()
	}, [currentUser])

	return (
		<ul
			className={clsx(
				classes.notesList,
				isListView && 'listView',
				isNoteOpened && 'noteOpened'
			)}
		>
			{noteList.map(note => (
				<li className={classes.note} key={note.id}>
					<Link to={`/note/${note.id}`} className={classes.noteLink}>
						<h5 className={classes.noteTitle}>{note.title}</h5>
						<p className={classes.noteText}>{note.text}</p>
					</Link>
				</li>
			))}
		</ul>
	)
}

export default NotesList
