import { FC } from 'react'

import classes from './KanbanBoard.module.scss'

import newColumnButton from '../../../../assets/icons/add-new-column-btn.svg'

const KanbanBoard: FC = () => {
	return (
		<div className={classes.inner}>
			<button className={classes.addNewColumnButton}>
				<img src={newColumnButton} alt='add new column' />
				<span>Add new column</span>
			</button>
		</div>
	)
}

export default KanbanBoard
