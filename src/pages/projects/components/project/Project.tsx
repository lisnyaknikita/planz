import { FC } from 'react'

import classes from './Project.module.scss'
import KanbanBoard from './kanban-board/KanbanBoard'

const ProjectPage: FC = () => {
	return (
		<div className={classes.wrapper}>
			<div className={classes.inner}>
				<h2 className={classes.projectTitle}>Project title</h2>
				<KanbanBoard />
			</div>
		</div>
	)
}

export default ProjectPage
