import { FC, useEffect } from 'react'

import { ID, Task } from '../../../types/types'
import classes from './TaskCard.module.scss'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import deleteTaskButton from '../../../../../assets/icons/delete.svg'
import { useTaskActions } from '../../../../../hooks/projects/kanban/useTaskActions'

interface ITaskCardProps {
	task: Task
	deleteTask: (id: ID) => void
	updateTask: (id: ID, content: string) => void
}

const TaskCard: FC<ITaskCardProps> = ({ task, deleteTask, updateTask }) => {
	const { editMode, setEditMode, priority, handlePriorityChange, textAreaRef } = useTaskActions(task)

	const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
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

	const priorityColors: { [key: string]: string } = {
		'A1. High priority': '#63D471',
		'A2. Medium priority': '#FF7D00',
		'A3. Low priority': '#03CEA4',
	}

	useEffect(() => {
		if (editMode && textAreaRef.current) {
			const textArea = textAreaRef.current
			textArea.focus()
			textArea.setSelectionRange(textArea.value.length, textArea.value.length)
		}
	}, [editMode, textAreaRef])

	if (editMode) {
		return (
			<div className={classes.task} ref={setNodeRef} style={style} {...attributes} {...listeners}>
				<div
					className={classes.priority}
					onClick={handlePriorityChange}
					style={{ backgroundColor: priorityColors[priority] }}
				>
					{priority}
				</div>
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
			</div>
		)
	}

	return (
		<div className={classes.task} ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<div
				className={classes.priority}
				onClick={handlePriorityChange}
				style={{ backgroundColor: priorityColors[priority] }}
			>
				{priority}
			</div>
			<div className={classes.taskContent} onClick={() => setEditMode(true)}>
				<p className={classes.taskContentWrapper}>{task.content}</p>
			</div>
			<button className={classes.deleteTaskButton} onClick={() => deleteTask(task.id)}>
				<img src={deleteTaskButton} alt='delete this task' />
			</button>
		</div>
	)
}

export default TaskCard
