// // // NotePage.tsx
// // import { FC, useState } from 'react'

// // import NotesList from '../notes-list/NotesList'
// // import classes from './Note.module.scss'

// // import searchIcon from '../../../../assets/icons/search.svg'

// // const NotePage: FC = () => {
// // 	const [noteText, setNoteText] = useState<string>(
// // 		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, quod.'
// // 	)
// // 	const [editMode, setEditMode] = useState<boolean>(false)

// // 	function toggleEditMode() {
// // 		setEditMode(prev => !prev)
// // 	}

// // 	return (
// // 		<div className={classes.wrapper}>
// // 			<div className={classes.inner}>
// // 				<label className={classes.search}>
// // 					<input className={classes.searchInput} type='search' />
// // 					<span className={classes.searchImage}>
// // 						<img src={searchIcon} alt='search icon' />
// // 					</span>
// // 				</label>
// // 				<div className={classes.content}>
// // 					<NotesList isListView={true} isNoteOpened={true} />
// // 					<div className={classes.noteItem}>
// // 						<h3 className={classes.noteTitle}>Title of the note</h3>
// // 						{editMode && (
// // 							<textarea
// // 								className={classes.noteTextArea}
// // 								value={noteText}
// // 								onChange={e => setNoteText(e.target.value)}
// // 								onBlur={() => setEditMode(false)}
// // 								onKeyDown={e => {
// // 									if (e.key === 'Enter' && e.shiftKey) setEditMode(false)
// // 								}}
// // 							/>
// // 						)}
// // 						{!editMode && (
// // 							<p className={classes.noteText} onClick={toggleEditMode}>
// // 								{noteText}
// // 							</p>
// // 						)}
// // 					</div>
// // 				</div>
// // 			</div>
// // 		</div>
// // 	)
// // }

// // export default NotePage

// import { FC, useState } from 'react'

// import NotesList from '../notes-list/NotesList'
// import classes from './Note.module.scss'

// import searchIcon from '../../../../assets/icons/search.svg'

// const NotePage: FC = () => {
// 	const [noteText, setNoteText] = useState<string>(
// 		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, quod.'
// 	)
// 	const [noteTitle, setNoteTitle] = useState<string>('Title of the note')
// 	const [editNoteMode, setEditNoteMode] = useState<boolean>(false)
// 	const [editTitleMode, setEditTitleMode] = useState<boolean>(false)

// 	return (
// 		<div className={classes.wrapper}>
// 			<div className={classes.inner}>
// 				<label className={classes.search}>
// 					<input className={classes.searchInput} type='search' />
// 					<span className={classes.searchImage}>
// 						<img src={searchIcon} alt='search icon' />
// 					</span>
// 				</label>
// 				<div className={classes.content}>
// 					<NotesList isListView={true} isNoteOpened={true} />
// 					<div className={classes.noteItem}>
// 						{editTitleMode ? (
// 							<input
// 								type='text'
// 								className={classes.noteTitleInput}
// 								onBlur={() => setEditTitleMode(false)}
// 								value={noteTitle}
// 								onChange={e => setNoteTitle(e.target.value)}
// 								onKeyDown={e => {
// 									if (e.key === 'Enter') setEditTitleMode(false)
// 								}}
// 							/>
// 						) : (
// 							<h3
// 								className={classes.noteTitle}
// 								onClick={() => setEditTitleMode(true)}
// 							>
// 								{noteTitle}
// 							</h3>
// 						)}
// 						{editNoteMode ? (
// 							<textarea
// 								className={classes.noteTextArea}
// 								value={noteText}
// 								onChange={e => setNoteText(e.target.value)}
// 								onBlur={() => setEditNoteMode(false)}
// 								onKeyDown={e => {
// 									if (e.key === 'Enter' && e.shiftKey) setEditNoteMode(false)
// 								}}
// 							/>
// 						) : (
// 							<p
// 								className={classes.noteText}
// 								onClick={() => setEditNoteMode(true)}
// 								style={{ whiteSpace: 'pre-wrap' }}
// 							>
// 								{noteText}
// 							</p>
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default NotePage
import { doc, getDoc } from 'firebase/firestore'
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../../../../firebaseConfig'
import searchIcon from '../../../../assets/icons/search.svg'
import NotesList from '../notes-list/NotesList'
import classes from './Note.module.scss'

const NotePage: FC = () => {
	const { noteId } = useParams<{ noteId: string }>()
	const [noteText, setNoteText] = useState<string>('')
	const [noteTitle, setNoteTitle] = useState<string>('')
	const [editNoteMode, setEditNoteMode] = useState<boolean>(false)
	const [editTitleMode, setEditTitleMode] = useState<boolean>(false)

	useEffect(() => {
		const fetchNote = async () => {
			if (noteId) {
				try {
					console.log('Fetching note with ID:', noteId)
					const noteRef = doc(db, 'notes', noteId)
					const noteSnap = await getDoc(noteRef)
					if (noteSnap.exists()) {
						const noteData = noteSnap.data()
						console.log('Note data:', noteData)
						setNoteTitle(noteData.title || '') // Provide default value if undefined
						setNoteText(noteData.text || '') // Provide default value if undefined
					} else {
						console.error('No such document!')
					}
				} catch (error) {
					console.error('Error fetching note:', error)
				}
			} else {
				console.error('No noteId provided')
			}
		}

		fetchNote()
	}, [noteId])

	return (
		<div className={classes.wrapper}>
			<button className={classes.deleteNoteButton}>
				<img src='' alt='delete this note' />
				<span>Delete this note</span>
			</button>
			<div className={classes.inner}>
				<label className={classes.search}>
					<input className={classes.searchInput} type='search' />
					<span className={classes.searchImage}>
						<img src={searchIcon} alt='search icon' />
					</span>
				</label>
				<div className={classes.content}>
					<NotesList isListView={true} isNoteOpened={true} />
					<div className={classes.noteItem}>
						{editTitleMode ? (
							<input
								type='text'
								className={classes.noteTitleInput}
								onBlur={() => setEditTitleMode(false)}
								value={noteTitle}
								onChange={e => setNoteTitle(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') setEditTitleMode(false)
								}}
							/>
						) : (
							<h3
								className={classes.noteTitle}
								onClick={() => setEditTitleMode(true)}
							>
								{noteTitle}
							</h3>
						)}
						{editNoteMode ? (
							<textarea
								className={classes.noteTextArea}
								value={noteText}
								onChange={e => setNoteText(e.target.value)}
								onBlur={() => setEditNoteMode(false)}
								onKeyDown={e => {
									if (e.key === 'Enter' && e.shiftKey) setEditNoteMode(false)
								}}
							/>
						) : (
							<p
								className={classes.noteText}
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
