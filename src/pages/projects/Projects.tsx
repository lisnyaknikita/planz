import { FC, useEffect, useState } from 'react'

import classes from './Projects.module.scss'

import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from '../../../firebaseConfig'
import plusButton from '../../assets/icons/plus.svg'
import Modal from '../../ui/modal/Modal'
import ProjectsList from './components/projects-list/ProjectsList'

const ProjectsPage: FC = () => {
	const [isProjectModalOpened, setIsProjectModalOpened] = useState<boolean>(false)
	const [newProjectTitle, setNewProjectTitle] = useState<string>('')
	const [newProjectDescription, setNewProjectDescription] = useState<string>('')
	const [error, setError] = useState<string>('')

	function toggleModalVisibility() {
		setIsProjectModalOpened(true)
	}

	const onSubmitProject = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!newProjectTitle.trim()) {
			setError('Title cannot be empty')
			return
		}

		try {
			await addDoc(collection(db, 'projects'), {
				title: newProjectTitle,
				description: newProjectDescription,
				userId: auth?.currentUser?.uid,
			})
			setNewProjectTitle('')
			setNewProjectDescription('')
			setError('')
			setIsProjectModalOpened(false)
		} catch (error) {
			setError('Failed to create project')
			console.error('Error creating project:', error)
		}
	}

	useEffect(() => {
		document.title = 'Planz | Projects'
	}, [])

	return (
		<>
			<div className={classes.wrapper}>
				<button className={classes.addProjectButton} onClick={toggleModalVisibility}>
					<img src={plusButton} alt='add new project' />
				</button>
				<div className={classes.inner}>
					{/* <label className={classes.search}>
						<input className={classes.searchInput} type='search' />
						<span className={classes.searchImage}>
							<img src={searchIcon} alt='search icon' />
						</span>
					</label> */}
					<ProjectsList />
				</div>
			</div>
			{isProjectModalOpened && (
				<Modal setIsProjectModalOpened={setIsProjectModalOpened} isProjectModalOpened={isProjectModalOpened}>
					<div className={classes.modalBody} onClick={e => e.stopPropagation()}>
						<form className={classes.createNewProjectForm} onSubmit={onSubmitProject}>
							<input
								className={classes.newProjectName}
								type='text'
								placeholder='Enter the project name'
								value={newProjectTitle}
								onChange={e => setNewProjectTitle(e.target.value)}
								required
								autoFocus
							/>
							<textarea
								className={classes.newProjectDescription}
								placeholder='Enter the project description'
								value={newProjectDescription}
								onChange={e => setNewProjectDescription(e.target.value)}
							></textarea>
							{error && <p className={classes.error}>{error}</p>}
							<button className={classes.createButton}>Create</button>
						</form>
					</div>
				</Modal>
			)}
		</>
	)
}

export default ProjectsPage
