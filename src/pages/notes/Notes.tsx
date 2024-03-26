import { FC } from 'react'

import classes from './Notes.module.scss'

import toggleButton from '../../assets/icons/cards-view.svg'
import searchIcon from '../../assets/icons/search.svg'
import NotesList from './components/notes-list/NotesList'

const NotesPage: FC = () => {
	return (
		<div className={classes.wrapper}>
			<button className={classes.toggleBtn}>
				<img src={toggleButton} alt='change notes view' />
			</button>
			<div className={classes.inner}>
				<label className={classes.search}>
					<input className={classes.searchInput} type='search' />
					<span className={classes.searchImage}>
						<img src={searchIcon} alt='search icon' />
					</span>
				</label>
				<NotesList />
				<ul className={classes.pagination}>
					<li className={classes.paginationItem}>1</li>
					<li className={classes.paginationItem}>2</li>
					<li className={classes.paginationItem}>3</li>
				</ul>
			</div>
		</div>
	)
}

export default NotesPage
