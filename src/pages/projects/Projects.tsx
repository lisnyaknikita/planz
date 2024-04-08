import { FC } from 'react'

import classes from './Projects.module.scss'

import deleteButton from '../../assets/icons/delete.svg'
import plusButton from '../../assets/icons/plus.svg'
import searchIcon from '../../assets/icons/search.svg'

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
				<ul className={classes.projectsList}>
					<li className={classes.projectCard}>
						<button className={classes.deleteProjectButton}>
							<img src={deleteButton} alt='delete project' />
						</button>
						<div className={classes.progress}>
							<span className={classes.percent}>25%</span>
						</div>
						<h4 className={classes.projectName}>Project name</h4>
						<p className={classes.projectDescription}>Project description</p>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default ProjectsPage
