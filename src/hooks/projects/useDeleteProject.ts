import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useDeleteProject = (setProjects: React.Dispatch<React.SetStateAction<any[]>>) => {
	const deleteProject = async (projectId: string) => {
		const confirmDelete = confirm('Do you really want to delete this project?')
		if (!confirmDelete) return

		try {
			await deleteDoc(doc(db, 'projects', projectId))
			setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId))
		} catch (error) {
			console.error('Error deleting project:', error)
		}
	}

	return { deleteProject }
}
