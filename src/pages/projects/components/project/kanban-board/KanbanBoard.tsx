import { FC } from 'react'
import { createPortal } from 'react-dom'

import newColumnButton from '../../../../../assets/icons/add-new-column-btn.svg'

import ColumnContainer from '../column-container/ColumnContainer'
import TaskCard from '../task-card/TaskCard'

import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import { useKanbanData } from '../../../../../hooks/projects/kanban/useKanbanData'
import { useKanbanDragAndDrop } from '../../../../../hooks/projects/kanban/useKanbanDragAndDrop'

import classes from './KanbanBoard.module.scss'

interface IKanbanBoardProps {
	projectId: string
}

const KanbanBoard: FC<IKanbanBoardProps> = ({ projectId }) => {
	const {
		columns,
		setColumns,
		tasks,
		setTasks,
		createNewColumn,
		updateColumnOrder,
		updateColumn,
		deleteColumn,
		createTask,
		deleteTask,
		updateTask,
		updateTaskColumn,
	} = useKanbanData(projectId)
	const { activeColumn, activeTask, columnsId, onDragEnd, onDragOver, onDragStart, sensors } = useKanbanDragAndDrop({
		columns,
		setColumns,
		tasks,
		setTasks,
		updateColumnOrder,
		updateTaskColumn,
	})

	return (
		<div className={classes.inner}>
			<DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
				<div className={classes.columns}>
					<SortableContext items={columnsId}>
						{columns.map(column => (
							<ColumnContainer
								column={column}
								deleteColumn={deleteColumn}
								updateColumn={updateColumn}
								createTask={createTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
								tasks={tasks.filter(task => task.columnId === column.id)}
								key={column.id}
							/>
						))}
					</SortableContext>
				</div>
				<button className={classes.addNewColumnButton} onClick={createNewColumn}>
					<img src={newColumnButton} alt='add new column' />
					<span>Add new column</span>
				</button>

				{createPortal(
					<DragOverlay>
						{activeColumn && (
							<ColumnContainer
								column={activeColumn}
								deleteColumn={deleteColumn}
								updateColumn={updateColumn}
								createTask={createTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
								tasks={tasks.filter(task => task.columnId === activeColumn.id)}
							/>
						)}
						{activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	)
}

export default KanbanBoard
