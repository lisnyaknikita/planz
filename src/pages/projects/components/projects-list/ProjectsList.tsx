import { FC } from 'react'
import { Link } from 'react-router-dom'

import deleteButton from '../../../../assets/icons/delete.svg'

import { useDeleteProject } from '../../../../hooks/projects/useDeleteProject'
import { useFetchProjects } from '../../../../hooks/projects/useFetchProjects'

import classes from './ProjectsList.module.scss'

const ProjectsList: FC = () => {
	const { projects, isLoading, setProjects } = useFetchProjects()
	const { deleteProject } = useDeleteProject(setProjects)

	if (isLoading) {
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
			{projects.length ? (
				projects.map(project => (
					<li className={classes.projectCard} key={project.id}>
						<button className={classes.deleteProjectButton} onClick={() => deleteProject(String(project.id))}>
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
