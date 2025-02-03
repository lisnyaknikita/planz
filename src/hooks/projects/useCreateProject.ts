import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../../firebaseConfig'

export const useCreateProject = () => {
	const [isProjectModalOpened, setIsProjectModalOpened] = useState<boolean>(false)
	const [newProjectTitle, setNewProjectTitle] = useState<string>('')
	const [newProjectDescription, setNewProjectDescription] = useState<string>('')
	const [error, setError] = useState<string>('')

	const navigate = useNavigate()

	const onSubmitProject = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!newProjectTitle.trim()) {
			setError('Title cannot be empty')
			return
		}

		try {
			const newProjectRef = await addDoc(collection(db, 'projects'), {
				title: newProjectTitle,
				description: newProjectDescription,
				userId: auth?.currentUser?.uid,
				createdAt: Timestamp.now(),
			})

			navigate(`/project/${newProjectRef.id}`)

			setNewProjectTitle('')
			setNewProjectDescription('')
			setError('')
			setIsProjectModalOpened(false)
		} catch (error) {
			setError('Failed to create project')
			console.error('Error creating project:', error)
		}
	}

	return {
		onSubmitProject,
		error,
		isProjectModalOpened,
		setIsProjectModalOpened,
		newProjectTitle,
		setNewProjectTitle,
		newProjectDescription,
		setNewProjectDescription,
	}
}
