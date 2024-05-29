import { FC, useState } from 'react'

import classes from './KanbanBoard.module.scss'

import newColumnButton from '../../../../../assets/icons/add-new-column-btn.svg'
import { Column, ID } from '../../../types/types'
import ColumnContainer from '../column-container/ColumnContainer'

const KanbanBoard: FC = () => {
	const [columns, setColumns] = useState<Column[]>([])

	function createNewColumn() {
		const columnToAdd = {
			id: columns.length + 1,
			title: `New column ${columns.length}`,
		}

		setColumns([...columns, columnToAdd])
	}

	function deleteColumn(id: ID) {
		const filteredColums = columns.filter(column => column.id !== id)

		setColumns(filteredColums)
	}

	return (
		<div className={classes.inner}>
			<div className={classes.columns}>
				{columns.map(column => (
					<ColumnContainer
						column={column}
						deleteColumn={deleteColumn}
						key={column.id}
					/>
				))}
			</div>
			<button className={classes.addNewColumnButton} onClick={createNewColumn}>
				<img src={newColumnButton} alt='add new column' />
				<span>Add new column</span>
			</button>
		</div>
	)
}

export default KanbanBoard
