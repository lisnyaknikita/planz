import { FC, useState } from 'react'

import classes from './ColumnContainer.module.scss'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import deleteColumnButton from '../../../../../assets/icons/delete.svg'
import { Column, ID } from '../../../types/types'

interface IColumnContainerProps {
	column: Column
	deleteColumn: (id: ID) => void
	updateColumn: (id: ID, title: string) => void
}

const ColumnContainer: FC<IColumnContainerProps> = ({
	column,
	deleteColumn,
	updateColumn,
}) => {
	const [editMode, setEditMode] = useState(false)

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		// isDragging,
	} = useSortable({
		id: column.id,
		data: {
			type: 'Column',
			column,
		},
		disabled: editMode,
	})

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	}

	// if (isDragging)
	// 	return (
	// 		<div
	// 			className={classes.columnContainer}
	// 			ref={setNodeRef}
	// 			style={(style, { border: '1px solid white' })}
	// 		></div>
	// 	)

	return (
		<div className={classes.columnContainer} ref={setNodeRef} style={style}>
			<div
				className={classes.titleAndDelete}
				onClick={() => setEditMode(true)}
				{...attributes}
				{...listeners}
			>
				<div className={classes.columnTitle}>
					{!editMode && column.title}
					{editMode && (
						<input
							className={classes.editTitleInput}
							type='text'
							value={column.title}
							onChange={e => updateColumn(column.id, e.target.value)}
							autoFocus
							onBlur={() => setEditMode(false)}
							onKeyDown={e => {
								if (e.key !== 'Enter') return
								setEditMode(false)
							}}
						/>
					)}
				</div>
				<button
					className={classes.deleteColumnButton}
					onClick={() => deleteColumn(column.id)}
				>
					<img src={deleteColumnButton} alt='delete column' />
				</button>
			</div>
			<div className={classes.tasks}>Tasks</div>
		</div>
	)
}

export default ColumnContainer
