'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Area, Task } from './types'
import TaskCard from './components/TaskCard'
import TaskForm from './components/TaskForm'
import DeadlineNotifier from './components/DeadlineNotifier'
import TaskCalendar from './components/TaskCalendar'
import { useRouter } from 'next/navigation'

const router = useRouter()

// Cek login
useEffect(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  if (!isLoggedIn) {
    router.push('/login')
  }
}, [router])

export default function Home() {
  const [areas, setAreas] = useState<Area[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // Ambil data areas dan tasks dari Supabase
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    const { data: areasData } = await supabase
      .from('areas')
      .select('*')
      .order('id')

    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (areasData) setAreas(areasData)
    if (tasksData) setTasks(tasksData)
    setLoading(false)
  }

  // Tambah task baru
  const handleAddTask = async (formData: {
    area_ids: number[]
    title: string
    description: string
    priority: Task['priority']
    deadline: string
  }) => {
    const { area_ids, ...rest } = formData

    // Buat task untuk setiap area yang dipilih
    const inserts = area_ids.map((area_id) => ({ ...rest, area_id }))

    const { data, error } = await supabase
      .from('tasks')
      .insert(inserts)
      .select()

    if (!error && data) {
      setTasks((prev) => [...data, ...prev])
      setShowForm(false)
    }
  }

  // Update status task
  const handleStatusChange = async (taskId: number, status: Task['status']) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', taskId)

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status } : t))
      )
    }
  }

  // Hapus task
  const handleDelete = async (taskId: number) => {
    const confirmed = confirm('Yakin ingin menghapus task ini?')
    if (!confirmed) return

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (!error) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    }
  }

  // Update deadline task
  const handleDeadlineChange = async (taskId: number, deadline: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ deadline, updated_at: new Date().toISOString() })
      .eq('id', taskId)

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, deadline } : t))
      )
    }
  }

  // Filter tasks berdasarkan area yang dipilih
  const filteredTasks = selectedArea
    ? tasks.filter((t) => t.area_id === selectedArea.id)
    : []

  // Hitung jumlah task per area
  const getTaskCount = (areaId: number) =>
    tasks.filter((t) => t.area_id === areaId).length

  // Hitung task yang deadline-nya dekat (dalam 3 hari)
  const getUrgentCount = (areaId: number) => {
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return tasks.filter(
      (t) =>
        t.area_id === areaId &&
        new Date(t.deadline) <= threeDaysFromNow &&
        t.status !== 'done'
    ).length
  }

  const priorities: Task['priority'][] = ['PU', 'PTU', 'UTP', 'TUTP']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DeadlineNotifier tasks={tasks} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">🍦 Campina Task Manager</h1>
            <p className="text-xs text-gray-400">Kelola tugas per cabang</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Tambah Task
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn')
                router.push('/login')
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Area Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() =>
                setSelectedArea(selectedArea?.id === area.id ? null : area)
              }
              className={`text-left p-5 rounded-2xl border-2 transition-all ${
                selectedArea?.id === area.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800 text-lg">{area.name}</h2>
                {getUrgentCount(area.id) > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {getUrgentCount(area.id)} urgent
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {getTaskCount(area.id)} task aktif
              </p>
            </button>
          ))}
        </div>

        {/* Task List per Area */}
        {selectedArea && (
          <div>
            {/* Area Title */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedArea.name}
              </h2>
              <span className="text-sm text-gray-400">
                {filteredTasks.length} task
              </span>
            </div>

            {/* Tasks grouped by priority */}
            {priorities.map((priority) => {
              const priorityTasks = filteredTasks.filter(
                (t) => t.priority === priority
              )
              if (priorityTasks.length === 0) return null

              const priorityLabels = {
                PU: '🔴 Penting & Urgent',
                PTU: '🟡 Penting & Tdk Urgent',
                UTP: '🔵 Urgent & Tdk Penting',
                TUTP: '⚪ Tdk Urgent & Tdk Penting',
              }

              return (
                <div key={priority} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">
                    {priorityLabels[priority]}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {priorityTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onDeadlineChange={handleDeadlineChange}
                      />
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Kalau tidak ada task */}
            {filteredTasks.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-sm">Belum ada task untuk {selectedArea.name}</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-3 text-blue-500 text-sm hover:underline"
                >
                  Tambah task pertama
                </button>
              </div>
            )}
          </div>
        )}

        {/* Kalender */}
        <div className="mb-8">
          <TaskCalendar tasks={tasks} areas={areas} />
        </div>

        {/* Kalau belum pilih area */}
        {!selectedArea && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">👆</p>
            <p className="text-sm">Pilih salah satu cabang di atas untuk melihat task-nya</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <TaskForm
          areas={areas}
          onSubmit={handleAddTask}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}