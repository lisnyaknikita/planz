import { FC, useState } from 'react'

import editTitleButton from '../../../../assets/icons/edit.svg'
import classes from './Project.module.scss'
import KanbanBoard from './kanban-board/KanbanBoard'

const ProjectPage: FC = () => {
	const [editMode, setEditMode] = useState(false)

	return (
		<div className={classes.wrapper}>
			<div className={classes.inner}>
				{!editMode ? (
					<div className={classes.projectTitle}>
						<h2>Project title</h2>
						<button className={classes.editTitleButton}>
							<img src={editTitleButton} alt='edit title' />
						</button>
					</div>
				) : (
					<div className={classes.projectTitle}>
						<input type='text' />
					</div>
					// TODO: доделать изменение названия проекта
				)}
				<KanbanBoard />
			</div>
		</div>
	)
}

export default ProjectPage
