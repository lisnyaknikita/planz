import { doc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { auth, db } from '../../firebaseConfig.ts'

const storage = getStorage()

const uploadAvatar = async (file: File): Promise<string> => {
	try {
		if (!auth.currentUser) throw new Error('User not authenticated')

		const user = auth.currentUser
		const storageRef = ref(storage, `avatars/${user.uid}`) // Используем user.uid как имя файла
		await uploadBytes(storageRef, file)
		const photoURL = await getDownloadURL(storageRef)

		// Обновляем аватар пользователя в Firestore
		await updateDoc(doc(db, 'users', user.uid), { avatar: photoURL })

		return photoURL
	} catch (error) {
		console.error('Error uploading avatar:', error)
		throw error
	}
}

export { uploadAvatar }
