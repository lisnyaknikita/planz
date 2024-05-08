import { FC } from 'react'

import clsx from 'clsx'
import { Link } from 'react-router-dom'
import classes from './NotesList.module.scss'

interface INotesListProps {
	isListView: boolean
	isNoteOpened?: boolean
}

const NotesList: FC<INotesListProps> = ({ isListView, isNoteOpened }) => {
	return (
		<ul
			className={clsx(
				classes.notesList,
				isListView && 'listView',
				isNoteOpened && 'noteOpened'
			)}
		>
			<li className={classes.note}>
				<Link to={'/note/1'} className={classes.noteLink}>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</Link>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
			<li className={classes.note}>
				<a className={classes.noteLink} href='#'>
					<h5 className={classes.noteTitle}>Title of the note</h5>
					<p className={classes.noteText}>Some big and important text</p>
				</a>
			</li>
		</ul>
	)
}

export default NotesList
