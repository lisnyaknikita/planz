import { FC, useEffect, useRef, useState } from 'react'

import { ID, Task } from '../../../types/types'
import classes from './TaskCard.module.scss'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import deleteTaskButton from '../../../../../assets/icons/delete.svg'

interface ITaskCardProps {
	task: Task
	deleteTask: (id: ID) => void
	updateTask: (id: ID, content: string) => void
	// moveTaskLeft: (taskId: string) => void
	// moveTaskRight: (taskId: string) => void
}

const TaskCard: FC<ITaskCardProps> = ({
	task,
	deleteTask,
	updateTask,
	// moveTaskLeft,
	// moveTaskRight,
}) => {
	const [editMode, setEditMode] = useState(false)

	const textAreaRef = useRef<HTMLTextAreaElement>(null)

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		// isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: 'Task',
			task,
		},
		disabled: editMode,
	})

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	}

	useEffect(() => {
		if (editMode && textAreaRef.current) {
			const textArea = textAreaRef.current
			textArea.focus()
			textArea.setSelectionRange(textArea.value.length, textArea.value.length)
		}
	}, [editMode])

	if (editMode) {
		return (
			<div
				className={classes.task}
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
			>
				<div className={classes.priority}>A1. High priority</div>
				<div className={classes.taskContent} onClick={() => setEditMode(true)}>
					<textarea
						className={classes.taskTextArea}
						ref={textAreaRef}
						value={task.content}
						onChange={e => updateTask(task.id, e.target.value)}
						autoFocus
						onBlur={() => setEditMode(false)}
						onKeyDown={e => {
							if (e.key === 'Enter' && e.shiftKey) setEditMode(false)
						}}
					></textarea>
				</div>
				{/* <button onClick={() => moveTaskLeft(String(task.id))}>Left</button>
				<button onClick={() => moveTaskRight(String(task.id))}>Right</button> */}
			</div>
		)
	}

	return (
		<div
			className={classes.task}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<div className={classes.priority}>A1. High priority</div>
			<div className={classes.taskContent} onClick={() => setEditMode(true)}>
				<p className={classes.taskContentWrapper}>{task.content}</p>
			</div>
			<button
				className={classes.deleteTaskButton}
				onClick={() => deleteTask(task.id)}
			>
				<img src={deleteTaskButton} alt='delete this task' />
			</button>
		</div>
	)
}

export default TaskCard
