import { FC, useEffect, useState } from 'react'

import classes from './Notes.module.scss'

import cardViewButton from '../../assets/icons/cards-view.svg'
import listViewButton from '../../assets/icons/list-view.svg'
import plusButton from '../../assets/icons/plus.svg'

import clsx from 'clsx'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../../firebaseConfig'
import { useNotesView } from '../../hooks/useNotesView'
import Modal from '../../ui/modal/Modal'
import NotesList from './components/notes-list/NotesList'

const NotesPage: FC = () => {
	const [isNotesModalOpened, setIsNotesModalOpened] = useState(false)
	const [newNoteTitle, setNewNoteTitle] = useState('')
	const [error, setError] = useState<string>('')
	const { isListView, onChangeView } = useNotesView()

	const navigate = useNavigate()

	function toggleModalVisibility() {
		setIsNotesModalOpened(true)
	}

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

	useEffect(() => {
		document.title = 'Planz | Notes'
	}, [])

	return (
		<div className={classes.wrapper}>
			<div className={classes.toggleBtn} onClick={onChangeView}>
				{!isListView ? (
					<>
						<button className={classes.cardViewButton}>
							<img src={cardViewButton} alt='change to card view' />
						</button>
						<button className={clsx(classes.listViewButton, 'hidden')}>
							<img src={listViewButton} alt='change to list view' />
						</button>
					</>
				) : (
					<>
						<button className={clsx(classes.listViewButton)}>
							<img src={listViewButton} alt='change to list view' />
						</button>
						<button className={clsx(classes.cardViewButton, 'hidden')}>
							<img src={cardViewButton} alt='change to card view' />
						</button>
					</>
				)}
			</div>
			<button className={classes.addNoteButton} onClick={toggleModalVisibility}>
				<img src={plusButton} alt='add new project' />
			</button>
			<div className={classes.inner}>
				{/* <label className={classes.search}>
					<input className={classes.searchInput} type='search' />
					<span className={classes.searchImage}>
						<img src={searchIcon} alt='search icon' />
					</span>
				</label> */}
				<NotesList isListView={isListView} />
				{/* {!isListView && (
					<ul className={classes.pagination}>
						<li className={classes.paginationItem}>1</li>
						<li className={classes.paginationItem}>2</li>
						<li className={classes.paginationItem}>3</li>
					</ul>
				)} */}
			</div>
			{isNotesModalOpened && (
				<Modal setIsNotesModalOpened={setIsNotesModalOpened} isNotesModalOpened={isNotesModalOpened}>
					<div className={classes.modalBody} onClick={e => e.stopPropagation()}>
						<form className={classes.createNewNoteForm} onSubmit={onSubmitNote}>
							<input
								className={classes.newNoteTitle}
								type='text'
								placeholder='Enter the note title'
								required
								autoFocus
								value={newNoteTitle}
								onChange={e => setNewNoteTitle(e.target.value)}
							/>
							{error && <p className={classes.error}>{error}</p>}
							<button type='submit' className={classes.createButton}>
								Create
							</button>
						</form>
					</div>
				</Modal>
			)}
		</div>
	)
}

export default NotesPage
