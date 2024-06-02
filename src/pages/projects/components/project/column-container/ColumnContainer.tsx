import { FC, useMemo, useState } from 'react'

import classes from './ColumnContainer.module.scss'

import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import deleteColumnButton from '../../../../../assets/icons/delete.svg'
import { Column, ID, Task } from '../../../types/types'

import addNewTaskIcon from '../../../../../assets/icons/add-new-column-btn.svg'
import TaskCard from '../task-card/TaskCard'

interface IColumnContainerProps {
	column: Column
	tasks: Task[]
	deleteColumn: (id: ID) => void
	updateColumn: (id: ID, title: string) => void
	createTask: (columnId: ID) => void
	deleteTask: (id: ID) => void
	updateTask: (id: ID, content: string) => void
}

const ColumnContainer: FC<IColumnContainerProps> = ({
	column,
	tasks,
	deleteColumn,
	updateColumn,
	createTask,
	deleteTask,
	updateTask,
}) => {
	const [editMode, setEditMode] = useState(false)

	const tasksIds = useMemo(() => {
		return tasks.map(task => task.id)
	}, [tasks])

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
			<div className={classes.tasks}>
				<SortableContext items={tasksIds}>
					{tasks.map(task => (
						<TaskCard
							key={task.id}
							task={task}
							deleteTask={deleteTask}
							updateTask={updateTask}
						/>
					))}
				</SortableContext>
			</div>
			<button
				className={classes.addNewTask}
				onClick={() => createTask(column.id)}
			>
				<img src={addNewTaskIcon} alt='add new task' />
				<span>Add new task</span>
			</button>
		</div>
	)
}

export default ColumnContainer
