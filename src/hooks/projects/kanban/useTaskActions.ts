import { doc, updateDoc } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { db } from '../../../../firebaseConfig'
import { ID, Task } from '../../../pages/projects/types/types'

export const useTaskActions = (task: Task) => {
	const [editMode, setEditMode] = useState(false)
	const [priority, setPriority] = useState<string>(task.priority || 'A1. High priority')
	const textAreaRef = useRef<HTMLTextAreaElement>(null)

	const priorities = useMemo(() => ['A1. High priority', 'A2. Medium priority', 'A3. Low priority'], [])

	const updateTaskPriority = useCallback(async (id: ID, newPriority: string) => {
		try {
			await updateDoc(doc(db, 'tasks', id.toString()), { priority: newPriority })
		} catch (error) {
			console.error('Error updating task priority: ', error)
		}
	}, [])

	const handlePriorityChange = useCallback(() => {
		const nextPriority = priorities[(priorities.indexOf(priority) + 1) % priorities.length]
		setPriority(nextPriority)
		updateTaskPriority(task.id, nextPriority)
	}, [priority, priorities, task.id, updateTaskPriority])

	useEffect(() => {
		if (editMode && textAreaRef.current) {
			const textArea = textAreaRef.current
			textArea.focus()
			textArea.setSelectionRange(textArea.value.length, textArea.value.length)
		}
	}, [editMode])

	return {
		editMode,
		setEditMode,
		priority,
		handlePriorityChange,
		textAreaRef,
	}
}
