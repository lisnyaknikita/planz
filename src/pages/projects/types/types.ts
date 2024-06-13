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
	projectId: string
}

export type Habit = {
	id: string
	title: string
	completed: boolean
}
