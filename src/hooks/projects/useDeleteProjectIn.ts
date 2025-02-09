import { deleteDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../../../firebaseConfig'

export const useDeleteProject = (projectId?: string) => {
	const navigate = useNavigate()

	const onDeleteProject = async () => {
		if (!projectId) return

		try {
			if (confirm('Do you really want to delete this project?')) {
				await deleteDoc(doc(db, 'projects', projectId))
				navigate('/projects')
			}
		} catch (error) {
			console.error('Error deleting project:', error)
		}
	}

	return { onDeleteProject }
}
