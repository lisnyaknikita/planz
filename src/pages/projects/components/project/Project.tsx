import { FC, useEffect, useState } from 'react'

import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../../../../../firebaseConfig'
import deleteProjectButton from '../../../../assets/icons/delete.svg'
import editTitleButton from '../../../../assets/icons/edit.svg'
import classes from './Project.module.scss'
import KanbanBoard from './kanban-board/KanbanBoard'

const ProjectPage: FC = () => {
	const { id: projectId } = useParams<{ id: string }>()
	const [editMode, setEditMode] = useState(false)
	const navigate = useNavigate()
	const [projectTitle, setProjectTitle] = useState<string>('')

	useEffect(() => {
		const fetchNote = async () => {
			if (projectId) {
				try {
					console.log('Fetching project with ID:', projectId)
					const projectRef = doc(db, 'projects', projectId)
					const projectSnap = await getDoc(projectRef)
					if (projectSnap.exists()) {
						const projectData = projectSnap.data()
						console.log('Project data:', projectData)
						setProjectTitle(projectData.title || '') // Provide default value if undefined
					} else {
						console.error('No such document!')
					}
				} catch (error) {
					console.error('Error fetching note:', error)
				}
			} else {
				console.error('No noteId provided')
			}
		}

		fetchNote()
	}, [projectId])

	const onDeleteProject = async () => {
		if (!projectId) return

		try {
			if (confirm('Do you realy want to delete this project?')) {
				await deleteDoc(doc(db, 'projects', projectId))
				navigate('/projects') // Redirect to project list page after deletion
			} else return
		} catch (error) {
			console.error('Error deleting project:', error)
		}
	}

	return (
		<div className={classes.wrapper}>
			<div className={classes.inner}>
				{!editMode ? (
					<div className={classes.projectTitle}>
						<h2>{projectTitle}</h2>
						<button className={classes.editTitleButton}>
							<img src={editTitleButton} alt='edit title' />
						</button>
						<button
							className={classes.deleteProjectButton}
							onClick={onDeleteProject}
						>
							<img src={deleteProjectButton} alt='delete this project' />
						</button>
					</div>
				) : (
					<div className={classes.projectTitle}>
						<input type='text' />
					</div>
					// TODO: доделать изменение названия проекта
				)}
				<KanbanBoard projectId={projectId} />
			</div>
		</div>
	)
}

export default ProjectPage
