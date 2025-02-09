import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../../firebaseConfig'

export const useProject = (projectId?: string) => {
	const [projectTitle, setProjectTitle] = useState<string>('')
	const [newTitle, setNewTitle] = useState<string>('')
	const [editMode, setEditMode] = useState(false)

	useEffect(() => {
		const fetchProject = async () => {
			if (!projectId) return

			try {
				const projectRef = doc(db, 'projects', projectId)
				const projectSnap = await getDoc(projectRef)

				if (projectSnap.exists()) {
					const projectData = projectSnap.data()
					setProjectTitle(projectData.title || '')
					document.title = `Planz | ${projectData.title}`
				} else {
					console.error('No such document!')
				}
			} catch (error) {
				console.error('Error fetching project:', error)
			}
		}

		fetchProject()
	}, [projectId])

	const handleEditClick = () => {
		setNewTitle(projectTitle)
		setEditMode(true)
	}

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTitle(e.target.value)
	}

	const handleTitleSave = async () => {
		if (!projectId || newTitle.trim() === '') return

		try {
			const projectRef = doc(db, 'projects', projectId)
			await updateDoc(projectRef, { title: newTitle })
			setProjectTitle(newTitle)
			setEditMode(false)
		} catch (error) {
			console.error('Error updating project title:', error)
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleTitleSave()
		} else if (e.key === 'Escape') {
			setEditMode(false)
		}
	}

	return {
		projectTitle,
		editMode,
		newTitle,
		setNewTitle,
		setEditMode,
		handleEditClick,
		handleTitleChange,
		handleTitleSave,
		handleKeyPress,
	}
}
