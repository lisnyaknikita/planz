import { FC, useEffect, useState } from 'react'

import deleteButton from '../../../../assets/icons/delete.svg'
import classes from './ProjectsList.module.scss'

import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { auth, db } from '../../../../../firebaseConfig'
import { Project } from '../../types/types'

const ProjectsList: FC = () => {
	const { currentUser } = auth
	const [projectList, setProjectList] = useState<
		{ id: string; title: string; description: string; color: string }[]
	>([])

	const colorsArray = [
		'#D65780',
		'#C7A27C',
		'#261447',
		'#646E68',
		'#B48EAE',
		'#1D8A99',
		'#C6B89E',
		'#230903',
		'#4B4237',
		'#D5A021',
		'#736B60',
		'#7C6A0A',
		'#EB6424',
		'#4381C1',
		'#4E4B5C',
		'#846C5B',
		'#443742',
		'#514B23',
		'#6761A8',
		'#F26430',
		'#2A2D34',
		'#113537',
		'#595F72',
		'#00823D',
		'#1E1919',
		'#323F28',
	]

	const getRandomColor = (colorsArray: string[]) => {
		const randomIndex = Math.floor(Math.random() * colorsArray.length)
		return colorsArray[randomIndex]
	}

	const projectsCollectionRef = collection(db, 'projects')

	const deleteProject = async (projectId: string) => {
		const confirmDelete = confirm('Do you really want to delete this project?')
		if (!confirmDelete) return

		try {
			await deleteDoc(doc(db, 'projects', projectId))

			setProjectList(prevProjects =>
				prevProjects.filter(project => project.id !== projectId)
			)
		} catch (error) {
			console.error('Error deleting project: ', error)
		}
	}

	useEffect(() => {
		const getProjectList = async () => {
			try {
				const q = query(
					projectsCollectionRef,
					where('userId', '==', currentUser?.uid)
				)
				const data = await getDocs(q)

				const filteredData = data.docs.map(doc => ({
					...(doc.data() as Project),
					id: doc.id,
					color: getRandomColor(colorsArray),
				}))
				setProjectList(filteredData)
			} catch (error) {
				console.error(error)
			}
		}

		getProjectList()
	}, [currentUser])

	return (
		<ul className={classes.projectsList}>
			{projectList.length ? (
				projectList.map(project => (
					<li
						className={classes.projectCard}
						key={project.id}
						style={{ backgroundColor: project.color }}
					>
						<button
							className={classes.deleteProjectButton}
							onClick={() => deleteProject(project.id)}
						>
							<img src={deleteButton} alt='delete project' />
						</button>
						{/* <div className={classes.progress}>
						<span className={classes.percent}>25%</span>
					</div> */}
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
