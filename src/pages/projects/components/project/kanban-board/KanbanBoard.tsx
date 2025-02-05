import { FC, useMemo, useState } from 'react'

import classes from './KanbanBoard.module.scss'

import newColumnButton from '../../../../../assets/icons/add-new-column-btn.svg'
import { Column, Task } from '../../../types/types'
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
import { useKanbanData } from '../../../../../hooks/projects/kanban/useKanbanData'
import TaskCard from '../task-card/TaskCard'

interface IKanbanBoardProps {
	projectId: string
}

const KanbanBoard: FC<IKanbanBoardProps> = ({ projectId }) => {
	const {
		columns,
		setColumns,
		tasks,
		setTasks,
		createNewColumn,
		updateColumnOrder,
		updateColumn,
		deleteColumn,
		createTask,
		deleteTask,
		updateTask,
		updateTaskColumn,
	} = useKanbanData(projectId)

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

	async function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null)
		setActiveTask(null)

		const { active, over } = event

		if (!over) return

		const activeColumnId = active.id
		const overColumnId = over.id

		if (active.data.current?.type === 'Column' && over.data.current?.type === 'Column') {
			const activeIndex = columns.findIndex(col => col.id === activeColumnId)
			const overIndex = columns.findIndex(col => col.id === overColumnId)

			if (activeIndex !== -1 && overIndex !== -1) {
				const updatedColumns = arrayMove(columns, activeIndex, overIndex)
				setColumns(updatedColumns)
				await updateColumnOrder(updatedColumns)
			}
		}

		if (active.data.current?.type === 'Task') {
			const activeTask = active.data.current.task as Task

			if (over.data.current?.type === 'Task') {
				const overTask = over.data.current.task as Task

				if (activeTask.columnId === overTask.columnId) {
					const newTasks = tasks.map(task =>
						task.id === activeTask.id ? { ...task, columnId: overTask.columnId } : task
					)
					setTasks(newTasks)

					await updateTaskColumn(activeTask.id, overTask.columnId)
				}
			} else if (over.data.current?.type === 'Column') {
				const overColumn = over.data.current.column as Column

				if (activeTask.columnId !== overColumn.id) {
					const newTasks = tasks.map(task => (task.id === activeTask.id ? { ...task, columnId: overColumn.id } : task))
					setTasks(newTasks)
					await updateTaskColumn(activeTask.id, overColumn.id)
				}
			}
		}
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

	return (
		<div className={classes.inner}>
			<DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
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
				<button className={classes.addNewColumnButton} onClick={createNewColumn}>
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
						{activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	)
}

export default KanbanBoard
