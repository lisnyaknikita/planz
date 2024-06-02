import { FC, useMemo, useState } from 'react'

import classes from './KanbanBoard.module.scss'

import newColumnButton from '../../../../../assets/icons/add-new-column-btn.svg'
import { Column, ID, Task } from '../../../types/types'
import ColumnContainer from '../column-container/ColumnContainer'

import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import TaskCard from '../task-card/TaskCard'

const KanbanBoard: FC = () => {
	const [columns, setColumns] = useState<Column[]>([])
	const [tasks, setTasks] = useState<Task[]>([])
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)

	const columnsId = useMemo(() => columns.map(col => col.id), [columns])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		})
	)

	function generateId() {
		/* Generate a random number between 0 and 10000 */
		return Math.floor(Math.random() * 10001)
	}

	function createNewColumn() {
		const columnToAdd = {
			id: generateId(),
			title: `Name a column...`,
		}

		setColumns([...columns, columnToAdd])
	}

	function deleteColumn(id: ID) {
		const filteredColumns = columns.filter(column => column.id !== id)

		setColumns(filteredColumns)

		const newTasks = tasks.filter(t => t.columnId !== id)

		setTasks(newTasks)
	}

	function onDragStart(event: DragStartEvent) {
		if (event.active.data.current?.type === 'Column') {
			setActiveColumn(event.active.data.current.column)
			return
		}

		if (event.active.data.current?.type === 'Task') {
			setActiveTask(event.active.data.current.task)
			return
		}
	}

	function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null)
		setActiveTask(null)

		const { active, over } = event

		if (!over) return

		const activeColumnId = active.id
		const overColumnId = over.id

		if (activeColumnId === overColumnId) return

		setColumns(columns => {
			const activeColumnIndex = columns.findIndex(
				col => col.id === activeColumnId
			)
			const overColumnIndex = columns.findIndex(col => col.id === overColumnId)

			return arrayMove(columns, activeColumnIndex, overColumnIndex)
		})
	}

	function onDragOver(event: DragOverEvent) {
		const { active, over } = event

		if (!over) return

		const activeColumnId = active.id
		const overColumnId = over.id

		if (activeColumnId === overColumnId) return

		const isActiveATask = active.data.current?.type === 'Task'
		const isOverATask = over.data.current?.type === 'Task'

		if (!isActiveATask) return

		if (isActiveATask && isOverATask) {
			setTasks(tasks => {
				const activeIndex = tasks.findIndex(t => t.id === activeColumnId)
				const overIndex = tasks.findIndex(t => t.id === overColumnId)

				tasks[activeIndex].columnId = tasks[overIndex].columnId

				return arrayMove(tasks, activeIndex, overIndex)
			})
		}

		const isOverAColumn = over.data.current?.type === 'Column'

		if (isActiveATask && isOverAColumn) {
			setTasks(tasks => {
				const activeIndex = tasks.findIndex(t => t.id === activeColumnId)

				tasks[activeIndex].columnId = overColumnId

				return arrayMove(tasks, activeIndex, activeIndex)
			})
		}
	}

	function updateColumn(id: ID, title: string) {
		const newColumns = columns.map(col => {
			if (col.id !== id) return col
			return { ...col, title }
		})

		setColumns(newColumns)
	}

	function createTask(columnId: ID) {
		const newTask: Task = {
			id: generateId(),
			columnId,
			content: `Name a task...`,
		}

		setTasks([...tasks, newTask])
	}

	function deleteTask(id: ID) {
		const filteresTasks = tasks.filter(task => task.id !== id)

		setTasks(filteresTasks)
	}

	function updateTask(id: ID, content: string) {
		const newTasks = tasks.map(task => {
			if (task.id !== id) return task

			return { ...task, content }
		})

		setTasks(newTasks)
	}

	return (
		<div className={classes.inner}>
			<DndContext
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}
				sensors={sensors}
			>
				<div className={classes.columns}>
					<SortableContext items={columnsId}>
						{columns.map(column => (
							<ColumnContainer
								column={column}
								deleteColumn={deleteColumn}
								updateColumn={updateColumn}
								createTask={createTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
								tasks={tasks.filter(task => task.columnId === column.id)}
								key={column.id}
							/>
						))}
					</SortableContext>
				</div>
				<button
					className={classes.addNewColumnButton}
					onClick={createNewColumn}
				>
					<img src={newColumnButton} alt='add new column' />
					<span>Add new column</span>
				</button>

				{createPortal(
					<DragOverlay>
						{activeColumn && (
							<ColumnContainer
								column={activeColumn}
								deleteColumn={deleteColumn}
								updateColumn={updateColumn}
								createTask={createTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
								tasks={tasks.filter(task => task.columnId === activeColumn.id)}
							/>
						)}
						{activeTask && (
							<TaskCard
								task={activeTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
							/>
						)}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	)
}

export default KanbanBoard
