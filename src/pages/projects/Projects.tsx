import { FC, useState } from 'react'

import classes from './Projects.module.scss'

import plusButton from '../../assets/icons/plus.svg'
import searchIcon from '../../assets/icons/search.svg'
import Modal from '../../ui/modal/Modal'
import ProjectsList from './components/projects-list/ProjectsList'

const ProjectsPage: FC = () => {
	const [isProjectModalOpened, setIsProjectModalOpened] = useState(false)

	function toggleModalVisibility() {
		setIsProjectModalOpened(true)
	}

	return (
		<>
			<div className={classes.wrapper}>
				<button
					className={classes.addProjectButton}
					onClick={toggleModalVisibility}
				>
					<img src={plusButton} alt='add new project' />
				</button>
				<div className={classes.inner}>
					<label className={classes.search}>
						<input className={classes.searchInput} type='search' />
						<span className={classes.searchImage}>
							<img src={searchIcon} alt='search icon' />
						</span>
					</label>
					<ProjectsList />
				</div>
			</div>
			{isProjectModalOpened && (
				<Modal
					setIsProjectModalOpened={setIsProjectModalOpened}
					isProjectModalOpened={isProjectModalOpened}
				>
					<div className={classes.modalBody} onClick={e => e.stopPropagation()}>
						<form className={classes.createNewProjectForm}>
							<input
								className={classes.newProjectName}
								type='text'
								placeholder='Enter the project name'
							/>
							<textarea
								className={classes.newProjectDescription}
								placeholder='Enter the project description'
							></textarea>
							<button className={classes.createButton}>Create</button>
						</form>
					</div>
				</Modal>
			)}
		</>
	)
}

export default ProjectsPage
