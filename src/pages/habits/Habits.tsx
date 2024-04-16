import { FC } from 'react'

import classes from './Habits.module.scss'

import completeButton from '../../assets/icons/complete-btn.svg'
import plusButton from '../../assets/icons/plus.svg'

const HabitsPage: FC = () => {
	return (
		<div className={classes.wrapper}>
			<button className={classes.addHabitButton}>
				<img src={plusButton} alt='add new habit' />
			</button>
			<div className={classes.inner}>
				<ul className={classes.habitsList}>
					<li className={classes.habit}>
						<p className={classes.habitName}>Mourning routine</p>
						<button className={classes.completeButton}>
							<img src={completeButton} alt='complete button' />
						</button>
					</li>
					<li className={classes.habit}>
						<p className={classes.habitName}>English words</p>
						<button className={classes.completeButton}>
							<img src={completeButton} alt='complete button' />
						</button>
					</li>
					<li className={classes.habit}>
						<p className={classes.habitName}>English words</p>
						<button className={classes.completeButton}>
							<img src={completeButton} alt='complete button' />
						</button>
					</li>
					<li className={classes.habit}>
						<p className={classes.habitName}>
							English wordEnglish words English words djslfk
						</p>
						<button className={classes.completeButton}>
							<img src={completeButton} alt='complete button' />
						</button>
					</li>
					<li className={classes.habit}>
						<p className={classes.habitName}>English words</p>
						<button className={classes.completeButton}>
							<img src={completeButton} alt='complete button' />
						</button>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default HabitsPage
