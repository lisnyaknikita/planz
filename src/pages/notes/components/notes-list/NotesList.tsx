import { FC } from 'react'

import classes from './NotesList.module.scss'

const Component: FC = () => {
	return (
		<ul className={classes.notesList}>
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

export default Component
