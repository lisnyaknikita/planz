import { FC, ReactNode } from 'react'

import classes from './Modal.module.scss'

interface IModalProps {
	children?: ReactNode | undefined
	setIsSettingsModalOpened?: (status: boolean) => void
	isSettingsModalOpened?: boolean
	setIsProjectModalOpened?: (status: boolean) => void
	isProjectModalOpened?: boolean
}

const Modal: FC<IModalProps> = ({
	children,
	setIsSettingsModalOpened,
	isSettingsModalOpened,
	setIsProjectModalOpened,
	isProjectModalOpened,
}) => {
	function onCloseModal() {
		if (isSettingsModalOpened && setIsSettingsModalOpened) {
			setIsSettingsModalOpened(false)
		}
		if (isProjectModalOpened && setIsProjectModalOpened) {
			setIsProjectModalOpened(false)
		}
	}

	return (
		<div className={classes.modalBg} onClick={onCloseModal}>
			{children}
		</div>
	)
}

export default Modal
