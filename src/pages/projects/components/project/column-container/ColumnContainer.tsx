import { FC } from 'react'

import classes from './ColumnContainer.module.scss'

import deleteColumnButton from '../../../../../assets/icons/delete.svg'
import { Column, ID } from '../../../types/types'

interface IColumnContainerProps {
	column: Column
	deleteColumn: (id: ID) => void
}

const ColumnContainer: FC<IColumnContainerProps> = ({
	column,
	deleteColumn,
}) => {
	return (
		<div className={classes.columnContainer}>
			<div className={classes.titleAndDelete}>
				<h4 className={classes.columnTitle}>{column.title}</h4>
				<button
					className={classes.deleteColumnButton}
					onClick={() => deleteColumn(column.id)}
				>
					<img src={deleteColumnButton} alt='delete column' />
				</button>
			</div>
			<div className={classes.tasks}>Tasks</div>
		</div>
	)
}

export default ColumnContainer
