import { FC, useState } from 'react'

import classes from './Habits.module.scss'

import completeButton from '../../assets/icons/complete-btn.svg'
import plusButton from '../../assets/icons/plus.svg'
import Modal from '../../ui/modal/Modal'

const HabitsPage: FC = () => {
	const [isHabitModalOpened, setIsHabitModalOpened] = useState(false)

	function toggleModalVisibility() {
		setIsHabitModalOpened(true)
	}

	return (
		<>
			<div className={classes.wrapper}>
				<button
					className={classes.addHabitButton}
					onClick={toggleModalVisibility}
				>
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
			{isHabitModalOpened && (
				<Modal
					setIsHabitModalOpened={setIsHabitModalOpened}
					isHabitModalOpened={isHabitModalOpened}
				>
					<div className={classes.modalBody} onClick={e => e.stopPropagation()}>
						<form className={classes.createNewHabitForm}>
							<input
								className={classes.newHabitName}
								type='text'
								placeholder='New habit...'
							/>
							<button className={classes.createButton}>Create new habit</button>
						</form>
					</div>
				</Modal>
			)}
		</>
	)
}

export default HabitsPage
