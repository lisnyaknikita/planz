import { FC, ReactNode } from 'react'

import classes from './Modal.module.scss'

interface IModalProps {
	children?: ReactNode | undefined
	setIsSettingsModalOpened?: (status: boolean) => void
	isSettingsModalOpened?: boolean
	setIsProjectModalOpened?: (status: boolean) => void
	isProjectModalOpened?: boolean
	setIsHabitModalOpened?: (status: boolean) => void
	isHabitModalOpened?: boolean
}

const Modal: FC<IModalProps> = ({
	children,
	setIsSettingsModalOpened,
	isSettingsModalOpened,
	setIsProjectModalOpened,
	isProjectModalOpened,
	setIsHabitModalOpened,
	isHabitModalOpened,
}) => {
	function onCloseModal() {
		if (isSettingsModalOpened && setIsSettingsModalOpened) {
			setIsSettingsModalOpened(false)
		}
		if (isProjectModalOpened && setIsProjectModalOpened) {
			setIsProjectModalOpened(false)
		}
		if (isHabitModalOpened && setIsHabitModalOpened) {
			setIsHabitModalOpened(false)
		}
	}

	return (
		<div className={classes.modalBg} onClick={onCloseModal}>
			{children}
		</div>
	)
}

export default Modal
