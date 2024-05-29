import { FC, useMemo, useState } from 'react'

import classes from './KanbanBoard.module.scss'

import newColumnButton from '../../../../../assets/icons/add-new-column-btn.svg'
import { Column, ID } from '../../../types/types'
import ColumnContainer from '../column-container/ColumnContainer'

import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'

const KanbanBoard: FC = () => {
	const [columns, setColumns] = useState<Column[]>([])
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)

	const columnsId = useMemo(() => columns.map(col => col.id), [columns])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		})
	)

	function createNewColumn() {
		const columnToAdd = {
			id: columns.length + 1,
			title: `New column ${columns.length}`,
		}

		setColumns([...columns, columnToAdd])
	}

	function deleteColumn(id: ID) {
		const filteredColumns = columns.filter(column => column.id !== id)

		setColumns(filteredColumns)
	}

	function onDragStart(event: DragStartEvent) {
		console.log('drag started', event)
		if (event.active.data.current?.type === 'Column') {
			setActiveColumn(event.active.data.current.column)
			return
		}
	}

	function onDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (!over) return

		const activeColumnId = active.id
		const overColumnId = over.id

		if (activeColumnId === overColumnId) return

		setColumns(columns => {
			const activeColumnIndex = columns.findIndex(
				col => col.id === activeColumnId
			)
			const overColumnIndex = columns.findIndex(col => col.id === overColumnId)

			return arrayMove(columns, activeColumnIndex, overColumnIndex)
		})
	}

	function updateColumn(id: ID, title: string) {
		const newColumns = columns.map(col => {
			if (col.id !== id) return col
			return { ...col, title }
		})

		setColumns(newColumns)
	}

	return (
		<div className={classes.inner}>
			<DndContext
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				sensors={sensors}
			>
				<div className={classes.columns}>
					<SortableContext items={columnsId}>
						{columns.map(column => (
							<ColumnContainer
								column={column}
								deleteColumn={deleteColumn}
								updateColumn={updateColumn}
								key={column.id}
							/>
						))}
					</SortableContext>
				</div>
				<button
					className={classes.addNewColumnButton}
					onClick={createNewColumn}
				>
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
							/>
						)}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	)
}

export default KanbanBoard
