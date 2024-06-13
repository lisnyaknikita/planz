import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()

const db = admin.firestore()

exports.resetHabitsStatus = functions.pubsub
	.schedule('every day 00:00')
	.onRun(async context => {
		const habitsRef = db.collection('habits')
		const snapshot = await habitsRef.get()

		const batch = db.batch()
		snapshot.forEach(doc => {
			batch.update(doc.ref, { completed: false })
		})

		await batch.commit()
		console.log('Habits status reset to false')
	})
