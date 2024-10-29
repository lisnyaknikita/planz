import { Timestamp } from 'firebase/firestore'

export type ID = string | number

export type Column = {
	id: ID
	title: string
	order: number
}

export type Task = {
	id: ID
	columnId: ID
	content: string
	order: number
	priority: string
	projectId: string
	createdAt: Timestamp
}

export type Habit = {
	id: string
	title: string
	completed: boolean
}

export type Note = {
	id: ID
	title: string
	text: string
	userId: string
}

export type Project = {
	id: ID
	title: string
	description: string
	userId: string
}
