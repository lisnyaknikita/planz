import { FC } from 'react'
import { useParams } from 'react-router-dom'

import deleteProjectButton from '../../../../assets/icons/delete.svg'
import editTitleButton from '../../../../assets/icons/edit.svg'

import KanbanBoard from './kanban-board/KanbanBoard'

import { useDeleteProject } from '../../../../hooks/projects/useDeleteProjectIn'
import { useProject } from '../../../../hooks/projects/useProject'

import classes from './Project.module.scss'

const ProjectPage: FC = () => {
	const { id: projectId } = useParams<{ id: string }>()

	const { projectTitle, editMode, newTitle, handleEditClick, handleTitleChange, handleTitleSave, handleKeyPress } =
		useProject(projectId)
	const { onDeleteProject } = useDeleteProject(projectId)

	return (
		<div className={classes.wrapper}>
			<div className={classes.inner}>
				{!editMode ? (
					<div className={classes.projectTitle}>
						<h2>{projectTitle}</h2>
						<button className={classes.editTitleButton} onClick={handleEditClick}>
							<img src={editTitleButton} alt='edit title' />
						</button>
						<button className={classes.deleteProjectButton} onClick={onDeleteProject}>
							<img src={deleteProjectButton} alt='delete this project' />
						</button>
					</div>
				) : (
					<div className={classes.projectTitle}>
						<input
							type='text'
							className={classes.editTitleInput}
							value={newTitle}
							onChange={handleTitleChange}
							onKeyDown={handleKeyPress}
							onBlur={handleTitleSave}
							autoFocus
						/>
					</div>
				)}
				<KanbanBoard projectId={projectId as string} />
			</div>
		</div>
	)
}

export default ProjectPage
