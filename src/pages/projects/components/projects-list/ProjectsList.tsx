import { FC, useEffect, useState } from 'react'

import deleteButton from '../../../../assets/icons/delete.svg'
import classes from './ProjectsList.module.scss'

import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { auth, db } from '../../../../../firebaseConfig'
import { Project } from '../../types/types'

const ProjectsList: FC = () => {
	const [isProjectsLoading, setIsProjectsLoading] = useState<boolean>(false)

	const { currentUser } = auth
	const [projectList, setProjectList] = useState<{ id: string; title: string; description: string }[]>([])

	const projectsCollectionRef = collection(db, 'projects')

	const deleteProject = async (projectId: string) => {
		const confirmDelete = confirm('Do you really want to delete this project?')
		if (!confirmDelete) return

		try {
			await deleteDoc(doc(db, 'projects', projectId))

			setProjectList(prevProjects => prevProjects.filter(project => project.id !== projectId))
		} catch (error) {
			console.error('Error deleting project: ', error)
		}
	}

	useEffect(() => {
		const getProjectList = async () => {
			setIsProjectsLoading(true)
			try {
				const q = query(projectsCollectionRef, where('userId', '==', currentUser?.uid), orderBy('createdAt', 'asc'))
				const data = await getDocs(q)

				const filteredData = data.docs.map(doc => ({
					...(doc.data() as Project),
					id: doc.id,
				}))
				setProjectList(filteredData)
			} catch (error) {
				console.error(error)
			} finally {
				setIsProjectsLoading(false)
			}
		}

		getProjectList()
	}, [currentUser])

	if (isProjectsLoading) {
		return (
			<p
				style={{
					fontSize: 30,
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			>
				Loading projects...
			</p>
		)
	}

	return (
		<ul className={classes.projectsList}>
			{projectList.length ? (
				projectList.map(project => (
					<li className={classes.projectCard} key={project.id}>
						<button className={classes.deleteProjectButton} onClick={() => deleteProject(project.id)}>
							<img src={deleteButton} alt='delete project' />
						</button>
						<Link to={`/project/${project.id}`} className={classes.projectName}>
							<h4>{project.title}</h4>
						</Link>
						<p className={classes.projectDescription}>{project.description}</p>
					</li>
				))
			) : (
				<p style={{ fontSize: 30 }}>Create your first project</p>
			)}
		</ul>
	)
}

export default ProjectsList
