import { FC } from 'react'

import classes from './Projects.module.scss'

import plusButton from '../../assets/icons/plus.svg'
import searchIcon from '../../assets/icons/search.svg'
import ProjectsList from './components/projects-list/ProjectsList'

const ProjectsPage: FC = () => {
	return (
		<div className={classes.wrapper}>
			<button className={classes.addProjectButton}>
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
	)
}

export default ProjectsPage
