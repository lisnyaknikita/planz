// // NotePage.tsx
// import { FC, useState } from 'react'

// import NotesList from '../notes-list/NotesList'
// import classes from './Note.module.scss'

// import searchIcon from '../../../../assets/icons/search.svg'

// const NotePage: FC = () => {
// 	const [noteText, setNoteText] = useState<string>(
// 		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, quod.'
// 	)
// 	const [editMode, setEditMode] = useState<boolean>(false)

// 	function toggleEditMode() {
// 		setEditMode(prev => !prev)
// 	}

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
// 						<h3 className={classes.noteTitle}>Title of the note</h3>
// 						{editMode && (
// 							<textarea
// 								className={classes.noteTextArea}
// 								value={noteText}
// 								onChange={e => setNoteText(e.target.value)}
// 								onBlur={() => setEditMode(false)}
// 								onKeyDown={e => {
// 									if (e.key === 'Enter' && e.shiftKey) setEditMode(false)
// 								}}
// 							/>
// 						)}
// 						{!editMode && (
// 							<p className={classes.noteText} onClick={toggleEditMode}>
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

import { FC, useState } from 'react'

import NotesList from '../notes-list/NotesList'
import classes from './Note.module.scss'

import searchIcon from '../../../../assets/icons/search.svg'

const NotePage: FC = () => {
	const [noteText, setNoteText] = useState<string>(
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, quod.'
	)
	const [editMode, setEditMode] = useState<boolean>(false)

	function toggleEditMode() {
		setEditMode(prev => !prev)
	}

	return (
		<div className={classes.wrapper}>
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
						<h3 className={classes.noteTitle}>Title of the note</h3>
						{editMode ? (
							<textarea
								className={classes.noteTextArea}
								value={noteText}
								onChange={e => setNoteText(e.target.value)}
								onBlur={() => setEditMode(false)}
								onKeyDown={e => {
									if (e.key === 'Enter' && e.shiftKey) setEditMode(false)
								}}
							/>
						) : (
							<p
								className={classes.noteText}
								onClick={toggleEditMode}
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
