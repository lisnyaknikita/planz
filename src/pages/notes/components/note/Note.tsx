import clsx from 'clsx'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../../../../../firebaseConfig'
import deleteIcon from '../../../../assets/icons/delete.svg'
import { useFetchNote } from '../../../../hooks/useFetchNote'
import NotesList from '../notes-list/NotesList'
import classes from './Note.module.scss'

const NotePage: FC = () => {
	const { noteId } = useParams<{ noteId: string }>()
	const navigate = useNavigate()
	const [editNoteMode, setEditNoteMode] = useState<boolean>(false)
	const [editTitleMode, setEditTitleMode] = useState<boolean>(false)
	const { isNoteLoading, noteText, noteTitle, setNoteText, setNoteTitle } = useFetchNote({ noteId })

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

	if (isNoteLoading) {
		return (
			<p
				style={{
					fontSize: 30,
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			>
				Loading note...
			</p>
		)
	}

	return (
		<div className={classes.wrapper}>
			<button className={classes.deleteNoteButton} onClick={onDeleteNote}>
				<img src={deleteIcon} alt='delete this note' />
				<span>Delete</span>
			</button>
			<div className={classes.inner}>
				<div className={classes.content}>
					<NotesList isListView={true} isNoteOpened={true} currentNoteId={noteId} />
					<div className={classes.noteItem}>
						{editTitleMode ? (
							<input
								autoFocus={true}
								type='text'
								className={classes.noteTitleInput}
								onBlur={onUpdateNote}
								value={noteTitle}
								onChange={e => setNoteTitle(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										setEditTitleMode(false)
										onUpdateNote()
									}
								}}
							/>
						) : (
							<h3 className={classes.noteTitle} onClick={() => setEditTitleMode(true)}>
								{noteTitle}
							</h3>
						)}
						{editNoteMode ? (
							<textarea
								autoFocus={true}
								className={classes.noteTextArea}
								value={noteText}
								onChange={e => setNoteText(e.target.value)}
								onBlur={onUpdateNote}
								onKeyDown={e => {
									if (e.key === 'Enter' && e.shiftKey) {
										setEditNoteMode(false)
										onUpdateNote()
									}
								}}
							/>
						) : (
							<p
								className={clsx(classes.noteText, noteText.length === 0 && 'empty')}
								onClick={() => setEditNoteMode(true)}
								style={{ whiteSpace: 'pre-wrap' }}
							>
								{noteText}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default NotePage
