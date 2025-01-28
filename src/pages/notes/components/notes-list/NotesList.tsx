import { FC } from 'react'
import { Link } from 'react-router-dom'

import clsx from 'clsx'

import { useFetchNoteList } from '../../../../hooks/useFetchNoteList'

import classes from './NotesList.module.scss'

interface INotesListProps {
	isListView: boolean
	isNoteOpened?: boolean
	currentNoteId?: string
}

const NotesList: FC<INotesListProps> = ({ isListView, isNoteOpened, currentNoteId }) => {
	const { noteList, isLoading } = useFetchNoteList()

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
