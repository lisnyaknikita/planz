import { FC } from 'react'

import classes from './ProjectsList.module.scss'

import deleteButton from '../../../../assets/icons/delete.svg'

const ProjectsList: FC = () => {
	return (
		<ul className={classes.projectsList}>
			<li className={classes.projectCard}>
				<button className={classes.deleteProjectButton}>
					<img src={deleteButton} alt='delete project' />
				</button>
				<div className={classes.progress}>
					<span className={classes.percent}>25%</span>
				</div>
				<a className={classes.projectName} href='#'>
					<h4>Project name</h4>
				</a>
				<p className={classes.projectDescription}>Project description</p>
			</li>
			<li className={classes.projectCard}>
				<button className={classes.deleteProjectButton}>
					<img src={deleteButton} alt='delete project' />
				</button>
				<div className={classes.progress}>
					<span className={classes.percent}>25%</span>
				</div>
				<a className={classes.projectName} href='#'>
					<h4>Project name</h4>
				</a>
				<p className={classes.projectDescription}>Project description</p>
			</li>
		</ul>
	)
}

export default ProjectsList
