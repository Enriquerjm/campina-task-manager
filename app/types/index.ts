export type Priority = 'PU' | 'PTU' | 'UTP' | 'TUTP'

export type Status = 'todo' | 'in_progress' | 'done'

export interface Area {
  id: number
  name: string
  created_at: string
}

export interface Task {
  id: number
  area_id: number
  title: string
  description: string
  priority: Priority
  deadline: string
  status: Status
  created_at: string
  updated_at: string
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  PU: 'Penting & Urgent',
  PTU: 'Penting & Tdk Urgent',
  UTP: 'Urgent & Tdk Penting',
  TUTP: 'Tdk Urgent & Tdk Penting',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  PU: 'bg-red-100 text-red-700 border-red-300',
  PTU: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  UTP: 'bg-blue-100 text-blue-700 border-blue-300',
  TUTP: 'bg-gray-100 text-gray-700 border-gray-300',
}

export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Selesai',
}

export const STATUS_COLORS: Record<Status, string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-600',
  done: 'bg-green-100 text-green-600',
}