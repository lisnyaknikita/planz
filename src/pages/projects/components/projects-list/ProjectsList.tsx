import { FC, useEffect, useState } from 'react'

import classes from './ProjectsList.module.scss'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { auth, db } from '../../../../../firebaseConfig'

const ProjectsList: FC = () => {
	const { currentUser } = auth
	const [projectList, setProjectList] = useState([])

	const projectsCollectionRef = collection(db, 'projects')

	useEffect(() => {
		const getProjectList = async () => {
			try {
				const q = query(
					projectsCollectionRef,
					where('userId', '==', currentUser?.uid)
				)
				const data = await getDocs(q)

				const filteredData = data.docs.map(doc => ({
					...doc.data(),
					id: doc.id,
				}))
				console.log(filteredData)
				setProjectList(filteredData)
			} catch (error) {
				console.error(error)
			}
		}

		getProjectList()
	}, [currentUser])

	console.log(projectList)

	return (
		<ul className={classes.projectsList}>
			{projectList.map(project => (
				<li className={classes.projectCard} key={project.id}>
					{/* <button className={classes.deleteProjectButton}>
						<img src={deleteButton} alt='delete project' />
					</button> */}
					<div className={classes.progress}>
						<span className={classes.percent}>25%</span>
					</div>
					<Link to={`/project/${project.id}`} className={classes.projectName}>
						<h4>{project.title}</h4>
					</Link>
					<p className={classes.projectDescription}>{project.description}</p>
				</li>
			))}
		</ul>
	)
}

export default ProjectsList
