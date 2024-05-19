import { PropsWithChildren } from 'react'

import classes from './Modal.module.scss'

const Modal: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className={classes.modalBg}>
			<div className={classes.modalBody}>{children}</div>
		</div>
	)
}

export default Modal
