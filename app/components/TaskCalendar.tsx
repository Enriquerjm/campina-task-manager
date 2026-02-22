'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const Calendar = dynamic(() => import('react-calendar'), { ssr: false })
import 'react-calendar/dist/Calendar.css'
import { Task, PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../types'


interface TaskCalendarProps {
  tasks: Task[]
  areas: { id: number; name: string }[]
}

export default function TaskCalendar({ tasks, areas }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Ambil semua tanggal yang ada task-nya
  const taskDates = tasks
    .filter((t) => t.status !== 'done')
    .map((t) => new Date(t.deadline).toDateString())

  // Cek apakah tanggal tertentu ada task-nya
  const hasTask = (date: Date) => taskDates.includes(date.toDateString())

  // Cek apakah ada task overdue di tanggal tersebut
  const hasOverdue = (date: Date) => {
    return tasks.some(
      (t) =>
        new Date(t.deadline).toDateString() === date.toDateString() &&
        new Date(t.deadline) < new Date() &&
        t.status !== 'done'
    )
  }

  // Ambil task berdasarkan tanggal yang dipilih
  const selectedTasks = selectedDate
    ? tasks.filter(
        (t) =>
          new Date(t.deadline).toDateString() === selectedDate.toDateString()
      )
    : []

  // Ambil nama area
  const getAreaName = (areaId: number) =>
    areas.find((a) => a.id === areaId)?.name || '-'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">📅 Kalender Deadline</h2>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Kalender */}
        <div className="flex-shrink-0">
          <style>{`
            .react-calendar {
              border: none !important;
              font-family: inherit !important;
              width: 100% !important;
            }
            .react-calendar__tile {
              border-radius: 8px !important;
              position: relative;
            }
            .react-calendar__tile--active {
              background: #3b82f6 !important;
              color: white !important;
            }
            .react-calendar__tile--now {
              background: #eff6ff !important;
              color: #3b82f6 !important;
              font-weight: bold;
            }
            .react-calendar__tile--active.react-calendar__tile--now {
              background: #3b82f6 !important;
              color: white !important;
            }
          `}</style>
          <Calendar
            onChange={(val) => setSelectedDate(val as Date)}
            value={selectedDate}
            tileContent={({ date }) => {
              if (hasOverdue(date)) {
                return (
                  <div className="flex justify-center mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                  </div>
                )
              }
              if (hasTask(date)) {
                return (
                  <div className="flex justify-center mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
                  </div>
                )
              }
              return null
            }}
          />

          {/* Legend */}
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
              Ada task
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
              Overdue
            </div>
          </div>
        </div>

        {/* Task list berdasarkan tanggal dipilih */}
        <div className="flex-1">
          {selectedDate ? (
            <>
              <h3 className="font-semibold text-gray-700 mb-3">
                {selectedDate.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>

              {selectedTasks.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border border-gray-100 rounded-xl p-3 hover:shadow-sm transition-shadow"
                    >
                      {/* Priority + Area */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-400">
                          {getAreaName(task.area_id)}
                        </span>
                      </div>

                      {/* Title */}
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                      )}

                      {/* Status */}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-2 inline-block ${STATUS_COLORS[task.status]}`}>
                        {STATUS_LABELS[task.status]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-3xl mb-2">🎉</p>
                  <p className="text-sm">Tidak ada task di tanggal ini</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p className="text-3xl mb-2">👆</p>
              <p className="text-sm">Klik tanggal di kalender untuk melihat task</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}