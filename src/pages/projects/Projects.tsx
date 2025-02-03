import { FC, useEffect } from 'react'

import plusButton from '../../assets/icons/plus.svg'

import Modal from '../../ui/modal/Modal'

import ProjectsList from './components/projects-list/ProjectsList'

import { useCreateProject } from '../../hooks/projects/useCreateProject'
import classes from './Projects.module.scss'

const ProjectsPage: FC = () => {
	const {
		error,
		onSubmitProject,
		isProjectModalOpened,
		newProjectDescription,
		newProjectTitle,
		setIsProjectModalOpened,
		setNewProjectDescription,
		setNewProjectTitle,
	} = useCreateProject()

	function toggleModalVisibility() {
		setIsProjectModalOpened(true)
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
