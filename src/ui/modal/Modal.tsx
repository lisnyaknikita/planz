import { PropsWithChildren } from 'react'

const Modal: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className={classes.modalBg}>
			<div className={clsx(classes.modalBody, !darkMode && 'light')}>
				{children}
			</div>
		</div>
	)
}

export default Modal
