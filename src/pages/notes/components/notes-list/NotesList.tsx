import { FC } from 'react'

import clsx from 'clsx'
import classes from './NotesList.module.scss'

interface INotesListProps {
	isListView: boolean
}

const NotesList: FC<INotesListProps> = ({ isListView }) => {
	return (
		<ul className={clsx(classes.notesList, isListView && 'listView')}>
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
