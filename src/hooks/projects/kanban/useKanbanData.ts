import {
	Timestamp,
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
import { useEffect, useState } from 'react'
import { db } from '../../../../firebaseConfig'
import { Column, ID, Task } from '../../../pages/projects/types/types'

export function useKanbanData(projectId: string) {
	const [columns, setColumns] = useState<Column[]>([])
	const [tasks, setTasks] = useState<Task[]>([])

	useEffect(() => {
		const fetchColumnsAndTasks = async () => {
			if (!projectId) return

			const columnsQuery = query(collection(db, 'columns'), where('projectId', '==', projectId), orderBy('order'))
			const columnsSnapshot = await getDocs(columnsQuery)
			setColumns(columnsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Column))

			const tasksQuery = query(
				collection(db, 'tasks'),
				where('projectId', '==', projectId),
				orderBy('order'),
				orderBy('priority'),
				orderBy('createdAt', 'asc')
			)
			const tasksSnapshot = await getDocs(tasksQuery)
			setTasks(tasksSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Task))
		}

		fetchColumnsAndTasks()
	}, [projectId])

	async function createNewColumn() {
		if (!projectId) return

		const columnToAdd = {
			title: 'Name a column...',
			order: columns.length,
			projectId,
		}

		try {
			const docRef = await addDoc(collection(db, 'columns'), columnToAdd)
			setColumns([...columns, { ...columnToAdd, id: docRef.id }])
		} catch (error) {
			console.error('Error adding column:', error)
		}
	}

	async function updateColumnOrder(updatedColumns: Column[]) {
		const batch = writeBatch(db)
		updatedColumns.forEach((column, index) => {
			batch.update(doc(db, 'columns', column.id.toString()), { order: index })
		})
		await batch.commit().catch(error => console.error('Error updating column order:', error))
	}

	async function deleteColumn(id: ID) {
		setColumns(columns.filter(column => column.id !== id))
		setTasks(tasks.filter(task => task.columnId !== id))
		await deleteDoc(doc(db, 'columns', id.toString())).catch(error => console.error('Error deleting column:', error))
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
			order: tasksInColumn.length,
			priority: 'A1. High priority',
			projectId: projectId,
			createdAt: Timestamp.now(),
		}

		try {
			const docRef = await addDoc(collection(db, 'tasks'), newTask)
			setTasks([...tasks, { ...newTask, id: docRef.id }])
		} catch (error) {
			console.error('Error creating task: ', error)
		}
	}

	async function deleteTask(id: ID) {
		setTasks(prevTasks => prevTasks.filter(task => task.id !== id))

		try {
			await deleteDoc(doc(db, 'tasks', id.toString()))
		} catch (error) {
			console.error('Error deleting task: ', error)
		}
	}

	async function updateTask(id: ID, content: string) {
		setTasks(prevTasks => prevTasks.map(task => (task.id === id ? { ...task, content } : task)))

		try {
			await updateDoc(doc(db, 'tasks', id.toString()), { content })
		} catch (error) {
			console.error('Error updating task: ', error)
		}
	}

	async function updateTaskColumn(taskId: ID, newColumnId: ID) {
		setTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? { ...task, columnId: newColumnId } : task)))

		try {
			await updateDoc(doc(db, 'tasks', taskId.toString()), { columnId: newColumnId })
		} catch (error) {
			console.error('Error updating task column: ', error)
		}
	}

	return {
		columns,
		tasks,
		createNewColumn,
		updateColumnOrder,
		deleteColumn,
		updateColumn,
		setColumns,
		setTasks,
		createTask,
		deleteTask,
		updateTask,
		updateTaskColumn,
	}
}
