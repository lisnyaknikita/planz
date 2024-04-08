import { FC, useState } from 'react'

import classes from './Notes.module.scss'

import cardViewButton from '../../assets/icons/cards-view.svg'
import listViewButton from '../../assets/icons/list-view.svg'
import searchIcon from '../../assets/icons/search.svg'

import clsx from 'clsx'
import NotesList from './components/notes-list/NotesList'

const NotesPage: FC = () => {
	const [isListView, setIsListView] = useState(false)

	function onChangeView() {
		setIsListView(prev => !prev)
	}

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
			<div className={classes.inner}>
				<label className={classes.search}>
					<input className={classes.searchInput} type='search' />
					<span className={classes.searchImage}>
						<img src={searchIcon} alt='search icon' />
					</span>
				</label>
				<NotesList isListView={isListView} />
				{!isListView && (
					<ul className={classes.pagination}>
						<li className={classes.paginationItem}>1</li>
						<li className={classes.paginationItem}>2</li>
						<li className={classes.paginationItem}>3</li>
					</ul>
				)}
			</div>
		</div>
	)
}

export default NotesPage
