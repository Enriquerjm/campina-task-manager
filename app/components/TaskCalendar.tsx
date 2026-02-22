'use client'

import { useState } from 'react'
import { Task, PRIORITY_COLORS, STATUS_LABELS, STATUS_COLORS } from '../types'

interface TaskCalendarProps {
  tasks: Task[]
  areas: { id: number; name: string }[]
}

export default function TaskCalendar({ tasks, areas }: TaskCalendarProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const getAreaName = (areaId: number) =>
    areas.find((a) => a.id === areaId)?.name || '-'

  // Hari pertama bulan ini jatuh di hari apa
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  // Total hari dalam bulan ini
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return tasks.filter((t) => t.deadline.startsWith(dateStr))
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  const isOverdueDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    return getTasksForDate(day).some(
      (t) => date < today && t.status !== 'done'
    )
  }

  const hasTaskDay = (day: number) =>
    getTasksForDate(day).some((t) => t.status !== 'done')

  const selectedTasks = selectedDate
    ? tasks.filter((t) => t.deadline.startsWith(selectedDate))
    : []

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ]

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">📅 Kalender Deadline</h2>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Kalender */}
        <div className="flex-shrink-0 w-full lg:w-80">

          {/* Header bulan */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              ‹
            </button>
            <h3 className="font-semibold text-gray-800">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              ›
            </button>
          </div>

          {/* Nama hari */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Grid tanggal */}
          <div className="grid grid-cols-7 gap-1">
            {/* Kosong sebelum hari pertama */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Tanggal */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const overdue = isOverdueDay(day)
              const hasTask = hasTaskDay(day)
              const selected = selectedDate === dateStr
              const todayMark = isToday(day)

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(selected ? null : dateStr)}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all
                    ${selected ? 'bg-blue-500 text-white' : ''}
                    ${todayMark && !selected ? 'bg-blue-50 text-blue-600 font-bold' : ''}
                    ${!selected && !todayMark ? 'hover:bg-gray-100 text-gray-700' : ''}
                  `}
                >
                  {day}
                  {(hasTask || overdue) && (
                    <span className={`w-1 h-1 rounded-full mt-0.5 ${overdue ? 'bg-red-500' : 'bg-blue-400'} ${selected ? 'bg-white' : ''}`} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              Ada task
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              Overdue
            </div>
          </div>
        </div>

        {/* Task list */}
        <div className="flex-1">
          {selectedDate ? (
            <>
              <h3 className="font-semibold text-gray-700 mb-3">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', {
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
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-400">
                          {getAreaName(task.area_id)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                      )}
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