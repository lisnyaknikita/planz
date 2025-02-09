import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../../../firebaseConfig'
import { Project } from '../../pages/projects/types/types'

export const useFetchProjects = () => {
	const [projects, setProjects] = useState<Project[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		const fetchProjects = async () => {
			setIsLoading(true)
			try {
				const projectsCollectionRef = collection(db, 'projects')
				const q = query(
					projectsCollectionRef,
					where('userId', '==', auth?.currentUser?.uid),
					orderBy('createdAt', 'asc')
				)
				const data = await getDocs(q)

				const projectList = data.docs.map(doc => ({
					...(doc.data() as Project),
					id: doc.id,
				}))

				setProjects(projectList)
			} catch (error) {
				console.error('Error fetching projects:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchProjects()
	}, [])

	return { projects, isLoading, setProjects }
}
