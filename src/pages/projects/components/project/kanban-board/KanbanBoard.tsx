import { FC, useEffect, useMemo, useState } from 'react'

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
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	writeBatch,
} from 'firebase/firestore'
import { createPortal } from 'react-dom'
import { db } from '../../../../../../firebaseConfig'
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

	useEffect(() => {
		const fetchColumns = async () => {
			const columnsCollectionRef = collection(db, 'columns')
			const columnsQuery = query(columnsCollectionRef, orderBy('order'))
			const columnsSnapshot = await getDocs(columnsQuery)
			const columnsData = columnsSnapshot.docs.map(
				doc =>
					({
						...doc.data(),
						id: doc.id,
					}) as Column
			)
			setColumns(columnsData)
		}

		fetchColumns()
	}, [])

	function generateId() {
		return Math.floor(Math.random() * 10001)
	}

	async function createNewColumn() {
		const columnToAdd = {
			// id: generateId(),
			title: `Name a column...`,
			order: columns.length,
		}

		try {
			const docRef = await addDoc(collection(db, 'columns'), columnToAdd)
			setColumns([...columns, { ...columnToAdd, id: docRef.id }])
		} catch (error) {
			console.error('Error adding column: ', error)
		}
	}

	async function updateColumnOrder(updatedColumns: Column[]) {
		const batch = writeBatch(db)
		updatedColumns.forEach((column, index) => {
			const columnRef = doc(db, 'columns', column.id.toString())
			batch.update(columnRef, { order: index })
		})

		try {
			await batch.commit()
		} catch (error) {
			console.error('Error updating column order: ', error)
		}
	}

	async function deleteColumn(id: ID) {
		const filteredColumns = columns.filter(column => column.id !== id)

		setColumns(filteredColumns)

		const newTasks = tasks.filter(t => t.columnId !== id)

		setTasks(newTasks)

		try {
			await deleteDoc(doc(db, 'columns', id.toString()))
		} catch (error) {
			console.error('Error deleting column: ', error)
		}
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

			const updatedColumns = arrayMove(
				columns,
				activeColumnIndex,
				overColumnIndex
			)
			updateColumnOrder(updatedColumns)
			return updatedColumns
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

	async function updateColumn(id: ID, title: string) {
		const newColumns = columns.map(col => {
			if (col.id !== id) return col
			return { ...col, title }
		})

		setColumns(newColumns)

		try {
			const columnRef = doc(db, 'columns', id.toString())
			await updateDoc(columnRef, { title })
		} catch (error) {
			console.error('Error updating column: ', error)
		}
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
