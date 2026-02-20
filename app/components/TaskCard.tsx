'use client'

import { useState } from 'react'
import { Task, PRIORITY_LABELS, PRIORITY_COLORS, STATUS_LABELS, STATUS_COLORS } from '../types'

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: number, status: Task['status']) => void
  onDelete: (taskId: number) => void
  onDeadlineChange: (taskId: number, deadline: string) => void
}

export default function TaskCard({ task, onStatusChange, onDelete, onDeadlineChange }: TaskCardProps) {
  const [editingDeadline, setEditingDeadline] = useState(false)
  const [newDeadline, setNewDeadline] = useState(task.deadline)

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'done'

  const handleDeadlineSubmit = () => {
    if (!newDeadline) return
    onDeadlineChange(task.id, newDeadline)
    setEditingDeadline(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">

      {/* Header: Priority Badge + Delete */}
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority} — {PRIORITY_LABELS[task.priority]}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-400 transition-colors ml-2 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 mb-3">{task.description}</p>
      )}

      {/* Deadline */}
      <div className="mb-3">
        {editingDeadline ? (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="text-xs border border-blue-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleDeadlineSubmit}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                setEditingDeadline(false)
                setNewDeadline(task.deadline)
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Batal
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
              📅 {new Date(task.deadline).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {isOverdue && <span className="ml-1">(Terlambat!)</span>}
            </span>
            <button
              onClick={() => setEditingDeadline(true)}
              className="text-xs text-blue-400 hover:text-blue-600 transition-colors underline"
            >
              Ubah
            </button>
          </div>
        )}
      </div>

      {/* Status Selector */}
      <div className="flex gap-1 flex-wrap">
        {(['todo', 'in_progress', 'done'] as Task['status'][]).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(task.id, s)}
            className={`text-xs px-2 py-1 rounded-full font-medium transition-all ${
              task.status === s
                ? STATUS_COLORS[s]
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  )
}