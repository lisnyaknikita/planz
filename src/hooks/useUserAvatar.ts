import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig'
import testAvatar from '../assets/icons/avatar.jpg'

export const useUserAvatar = () => {
	const [avatar, setAvatar] = useState<string>(testAvatar)

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				if (auth.currentUser) {
					const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
					if (userDoc.exists()) {
						const userData = userDoc.data()
						if (userData.avatar) {
							setAvatar(userData.avatar)
						}
					}
				}
			} catch (error) {
				console.error(error)
			}
		}

		fetchUserData()
	}, [])

	return { avatar, setAvatar }
}
