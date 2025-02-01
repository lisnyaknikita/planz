import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../../../firebaseConfig'

export const useNotesView = () => {
	const [isListView, setIsListView] = useState(false)
	const currentUser = auth?.currentUser

	const fetchUserViewPreference = async () => {
		if (!currentUser) return

		try {
			const userDocRef = doc(db, 'users', currentUser.uid)
			const userDoc = await getDoc(userDocRef)

			if (userDoc.exists()) {
				const userData = userDoc.data()
				if (userData && typeof userData.isListView === 'boolean') {
					setIsListView(userData.isListView)
				}
			}
		} catch (error) {
			console.error('Error fetching user view preference:', error)
		}
	}

	const saveUserViewPreference = async (newView: boolean) => {
		if (!currentUser) return

		try {
			const userDocRef = doc(db, 'users', currentUser.uid)
			await setDoc(userDocRef, { isListView: newView }, { merge: true })
		} catch (error) {
			console.error('Error saving user view preference:', error)
		}
	}

	function onChangeView() {
		setIsListView(prev => {
			const newView = !prev
			saveUserViewPreference(newView)
			return newView
		})
	}

	useEffect(() => {
		if (currentUser) {
			fetchUserViewPreference()
		}
	}, [currentUser])

	return { isListView, onChangeView }
}
