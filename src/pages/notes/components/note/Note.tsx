// NotePage.tsx
import { FC } from 'react'

import NotesList from '../notes-list/NotesList'
import classes from './Note.module.scss'

import searchIcon from '../../../../assets/icons/search.svg'

const NotePage: FC = () => {
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
						<p className={classes.noteText}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident,
							sunt in culpa qui officia deserunt mollit anim id est laborum
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NotePage
