import { FC, useEffect, useState } from 'react'

import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
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
	const [newTitle, setNewTitle] = useState<string>('')

	useEffect(() => {
		const fetchNote = async () => {
			if (projectId) {
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
					console.error('Error fetching note:', error)
				}
			} else {
				console.error('No noteId provided')
			}
		}

		fetchNote()
	}, [projectId])

	// const onDeleteProject = async () => {
	// 	if (!projectId) return

	// 	try {
	// 		if (confirm('Do you realy want to delete this project?')) {
	// 			await deleteDoc(doc(db, 'projects', projectId))
	// 			navigate('/projects')
	// 		} else return
	// 	} catch (error) {
	// 		console.error('Error deleting project:', error)
	// 	}
	// }
	const onDeleteProject = async () => {
		if (!projectId) return

		try {
			if (confirm('Do you really want to delete this project?')) {
				// Удаление связанных колонок
				const columnsRef = collection(db, 'columns')
				const columnsQuery = query(columnsRef, where('projectId', '==', projectId))
				const columnsSnapshot = await getDocs(columnsQuery)
				const columnIds: string[] = []

				for (const columnDoc of columnsSnapshot.docs) {
					columnIds.push(columnDoc.id)
					await deleteDoc(columnDoc.ref)
				}

				// Удаление связанных задач
				const tasksRef = collection(db, 'tasks')
				const tasksQuery = query(tasksRef, where('projectId', '==', projectId))
				const tasksSnapshot = await getDocs(tasksQuery)

				for (const taskDoc of tasksSnapshot.docs) {
					await deleteDoc(taskDoc.ref)
				}

				// Удаление проекта
				await deleteDoc(doc(db, 'projects', projectId))
				navigate('/projects')
			} else {
				return
			}
		} catch (error) {
			console.error('Error deleting project and related documents:', error)
		}
	}

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

	return (
		<div className={classes.wrapper}>
			<div className={classes.inner}>
				{!editMode ? (
					<div className={classes.projectTitle}>
						<h2>{projectTitle}</h2>
						<button className={classes.editTitleButton} onClick={handleEditClick}>
							<img src={editTitleButton} alt='edit title' />
						</button>
						<button className={classes.deleteProjectButton} onClick={onDeleteProject}>
							<img src={deleteProjectButton} alt='delete this project' />
						</button>
					</div>
				) : (
					<div className={classes.projectTitle}>
						<input
							type='text'
							className={classes.editTitleInput}
							value={newTitle}
							onChange={handleTitleChange}
							onKeyDown={handleKeyPress}
							onBlur={handleTitleSave}
							autoFocus
						/>
					</div>
				)}
				<KanbanBoard projectId={projectId as string} />
			</div>
		</div>
	)
}

export default ProjectPage
