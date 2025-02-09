import { DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { Column, ID, Task } from '../../../pages/projects/types/types'

interface IUseKanbanDragAndDropProps {
	columns: Column[]
	setColumns: React.Dispatch<React.SetStateAction<Column[]>>
	tasks: Task[]
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>
	updateColumnOrder: (updatedColumns: Column[]) => Promise<void>
	updateTaskColumn: (taskId: ID, newColumnId: ID) => Promise<void>
}

export const useKanbanDragAndDrop = ({
	columns,
	tasks,
	setColumns,
	setTasks,
	updateColumnOrder,
	updateTaskColumn,
}: IUseKanbanDragAndDropProps) => {
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

	return { onDragEnd, onDragStart, onDragOver, sensors, columnsId, activeColumn, activeTask }
}
