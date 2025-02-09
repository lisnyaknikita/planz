import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useCallback } from 'react'
import { db } from '../../../../firebaseConfig'
import { ID } from '../../../pages/projects/types/types'

export const useColumnActions = (updateColumn: (id: ID, title: string) => void, deleteColumn: (id: ID) => void) => {
	const handleUpdateColumn = useCallback(
		async (id: ID, title: string) => {
			updateColumn(id, title)
			try {
				await updateDoc(doc(db, 'columns', id.toString()), { title })
			} catch (error) {
				console.error('Error updating column in Firestore:', error)
			}
		},
		[updateColumn]
	)

	const handleDeleteColumn = useCallback(
		async (id: ID) => {
			deleteColumn(id)
			try {
				await deleteDoc(doc(db, 'columns', id.toString()))
			} catch (error) {
				console.error('Error deleting column from Firestore:', error)
			}
		},
		[deleteColumn]
	)

	return { handleUpdateColumn, handleDeleteColumn }
}
