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
	where,
	writeBatch,
} from 'firebase/firestore'
import { createPortal } from 'react-dom'
import { db } from '../../../../../../firebaseConfig'
import TaskCard from '../task-card/TaskCard'

interface IKanbanBoardProps {
	projectId: string
}

const KanbanBoard: FC<IKanbanBoardProps> = ({ projectId }) => {
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

	// useEffect(() => {
	// 	const fetchColumns = async () => {
	// 		const columnsCollectionRef = collection(db, 'columns')
	// 		const columnsQuery = query(columnsCollectionRef, orderBy('order'))
	// 		const columnsSnapshot = await getDocs(columnsQuery)
	// 		const columnsData = columnsSnapshot.docs.map(
	// 			doc =>
	// 				({
	// 					...doc.data(),
	// 					id: doc.id,
	// 				}) as Column
	// 		)
	// 		setColumns(columnsData)
	// 	}

	// 	fetchColumns()
	// }, [])

	useEffect(() => {
		const fetchColumnsAndTasks = async () => {
			if (!projectId) return

			const columnsCollectionRef = collection(db, 'columns')
			const columnsQuery = query(
				columnsCollectionRef,
				where('projectId', '==', projectId),
				orderBy('order')
			)
			const columnsSnapshot = await getDocs(columnsQuery)
			const columnsData = columnsSnapshot.docs.map(
				doc =>
					({
						...doc.data(),
						id: doc.id,
					}) as Column
			)
			setColumns(columnsData)

			const tasksCollectionRef = collection(db, 'tasks')
			const tasksQuery = query(
				tasksCollectionRef,
				where('projectId', '==', projectId),
				orderBy('order')
			)
			const tasksSnapshot = await getDocs(tasksQuery)
			const tasksData = tasksSnapshot.docs.map(
				doc =>
					({
						...doc.data(),
						id: doc.id,
					}) as Task
			)
			setTasks(tasksData)
		}

		fetchColumnsAndTasks()
	}, [projectId])

	async function createNewColumn() {
		if (!projectId) {
			console.error('Project ID is not defined')
			return
		}

		const columnToAdd = {
			title: `Name a column...`,
			order: columns.length,
			projectId: projectId,
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
			console.log(event.active.data.current?.task)

			return
		}
	}

	// function onDragEnd(event: DragEndEvent) {
	// 	setActiveColumn(null)
	// 	setActiveTask(null)

	// 	const { active, over } = event

	// 	if (!over) return

	// 	const activeColumnId = active.id
	// 	const overColumnId = over.id

	// 	if (activeColumnId === overColumnId) return

	// 	setColumns(columns => {
	// 		const activeColumnIndex = columns.findIndex(
	// 			col => col.id === activeColumnId
	// 		)
	// 		const overColumnIndex = columns.findIndex(col => col.id === overColumnId)

	// 		const updatedColumns = arrayMove(
	// 			columns,
	// 			activeColumnIndex,
	// 			overColumnIndex
	// 		)
	// 		updateColumnOrder(updatedColumns)
	// 		return updatedColumns
	// 	})
	// }
	async function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null)
		setActiveTask(null)

		const { active, over } = event

		console.log(
			'drag ended',
			event.active.data.current?.task.columnId,
			event.over?.data.current?.task.columnId
		)
		if (!over) return

		if (active.id === over.id) return

		const activeColumnId = active.id
		const overColumnId = over.id

		if (
			active.data.current?.type === 'Column' &&
			over.data.current?.type === 'Column'
		) {
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

				if (activeTask.columnId !== overTask.columnId) {
					const newTasks = tasks.map(task =>
						task.id === activeTask.id
							? { ...task, columnId: overTask.columnId }
							: task
					)
					setTasks(newTasks)
					await updateTaskColumn(activeTask.id, overTask.columnId)
				}
			} else if (over.data.current?.type === 'Column') {
				const overColumn = over.data.current.column as Column

				if (activeTask.columnId !== overColumn.id) {
					const newTasks = tasks.map(task =>
						task.id === activeTask.id
							? { ...task, columnId: overColumn.id }
							: task
					)
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

	async function createTask(columnId: ID) {
		const tasksInColumn = tasks.filter(task => task.columnId === columnId)
		const newTask: Omit<Task, 'id'> = {
			columnId,
			content: `Name a task...`,
			order: tasksInColumn.length, // Порядок задачи в колонке
			projectId: projectId,
		}

		try {
			const docRef = await addDoc(collection(db, 'tasks'), newTask)
			setTasks([...tasks, { ...newTask, id: docRef.id }])
		} catch (error) {
			console.error('Error creating task: ', error)
		}
	}

	async function deleteTask(id: ID) {
		const filteredTasks = tasks.filter(task => task.id !== id)
		setTasks(filteredTasks)

		try {
			await deleteDoc(doc(db, 'tasks', id.toString()))
		} catch (error) {
			console.error('Error deleting task: ', error)
		}
	}

	async function updateTask(id: ID, content: string) {
		const newTasks = tasks.map(task => {
			if (task.id !== id) return task
			return { ...task, content }
		})

		setTasks(newTasks)

		try {
			const taskRef = doc(db, 'tasks', id.toString())
			await updateDoc(taskRef, { content })
		} catch (error) {
			console.error('Error updating task: ', error)
		}
	}

	async function updateTaskColumn(taskId: ID, newColumnId: ID) {
		const taskRef = doc(db, 'tasks', taskId.toString())
		try {
			await updateDoc(taskRef, { columnId: newColumnId })
		} catch (error) {
			console.error('Error updating task column: ', error)
		}
	}

	// function moveTaskLeft(taskId: string) {
	// 	const task = tasks.find(t => t.id === taskId)
	// 	if (!task) return

	// 	const currentColumnIndex = columns.findIndex(c => c.id === task.columnId)
	// 	if (currentColumnIndex > 0) {
	// 		const newColumnId = columns[currentColumnIndex - 1].id
	// 		updateTaskColumn(taskId, newColumnId)
	// 	}
	// }

	// function moveTaskRight(taskId: string) {
	// 	const task = tasks.find(t => t.id === taskId)
	// 	if (!task) return

	// 	const currentColumnIndex = columns.findIndex(c => c.id === task.columnId)
	// 	if (currentColumnIndex < columns.length - 1) {
	// 		const newColumnId = columns[currentColumnIndex + 1].id
	// 		updateTaskColumn(taskId, newColumnId)
	// 	}
	// }

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
								// moveTaskLeft={moveTaskLeft}
								// moveTaskRight={moveTaskRight}
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
								// moveTaskLeft={moveTaskLeft}
								// moveTaskRight={moveTaskRight}
								tasks={tasks.filter(task => task.columnId === activeColumn.id)}
							/>
						)}
						{activeTask && (
							<TaskCard
								task={activeTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
								// moveTaskLeft={moveTaskLeft}
								// moveTaskRight={moveTaskRight}
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
