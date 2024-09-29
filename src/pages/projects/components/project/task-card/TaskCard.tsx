import { FC, useEffect, useRef, useState } from 'react'

import { ID, Task } from '../../../types/types'
import classes from './TaskCard.module.scss'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../../../firebaseConfig'
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
	const [priority, setPriority] = useState<string>(
		task.priority || 'A1. High priority'
	)

	const textAreaRef = useRef<HTMLTextAreaElement>(null)

	const priorities = [
		'A1. High priority',
		'A2. Medium priority',
		'A3. Low priority',
	]

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

	const priorityColors: { [key: string]: string } = {
		'A1. High priority': '#63D471', // Зеленый
		'A2. Medium priority': '#FF7D00', // Оранжевый
		'A3. Low priority': '#03CEA4', // Голубой
	}

	const handlePriorityChange = () => {
		const currentPriorityIndex = priorities.indexOf(priority)
		const nextPriority =
			priorities[(currentPriorityIndex + 1) % priorities.length]
		setPriority(nextPriority) // Локальное обновление приоритета
		updateTaskPriority(task.id, nextPriority) // Обновление в базе данных
	}

	async function updateTaskPriority(id: ID, newPriority: string) {
		try {
			const taskRef = doc(db, 'tasks', id.toString())
			await updateDoc(taskRef, { priority: newPriority }) // Обновление приоритета в базе данных
		} catch (error) {
			console.error('Error updating task priority: ', error)
		}
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
