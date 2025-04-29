import { FC, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import clsx from 'clsx'

import deleteIcon from '../../../../assets/icons/delete.svg'

import { useFetchNote } from '../../../../hooks/notes/useFetchNote'
import { useNoteActions } from '../../../../hooks/notes/useNoteActions'

import NotesList from '../notes-list/NotesList'

import classes from './Note.module.scss'

const NotePage: FC = () => {
	const { noteId } = useParams<{ noteId: string }>()

	const { isNoteLoading, noteText, noteTitle, setNoteText, setNoteTitle } = useFetchNote({ noteId })
	const { editNoteMode, editTitleMode, onDeleteNote, onUpdateNote, setEditNoteMode, setEditTitleMode } = useNoteActions(
		{ noteId, noteText, noteTitle }
	)

	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (editNoteMode && textareaRef.current) {
			const textarea = textareaRef.current
			const length = textarea.value.length
			textarea.focus()
			textarea.setSelectionRange(length, length)
			textarea.scrollTop = textarea.scrollHeight
		}
	}, [editNoteMode])

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
								ref={textareaRef}
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
