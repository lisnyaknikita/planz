let timerInterval: NodeJS.Timeout | null = null

self.onmessage = function (
	e: MessageEvent<{
		action: 'start' | 'stop'
		duration?: number
		phase?: 'flow' | 'break'
	}>
) {
	const { action, duration, phase } = e.data
	let remainingDuration = duration || 0

	if (action === 'start' && remainingDuration > 0) {
		if (timerInterval) clearInterval(timerInterval)
		timerInterval = setInterval(() => {
			remainingDuration -= 1

			self.postMessage({ duration: remainingDuration, phase })

			if (remainingDuration <= 0) {
				clearInterval(timerInterval!)
				self.postMessage({ action: 'complete', phase })
			}
		}, 1000)
	} else if (action === 'stop') {
		if (timerInterval) {
			clearInterval(timerInterval)
		}
	}
}
