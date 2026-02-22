'use client'

import { useState } from 'react'
import { Priority, PRIORITY_LABELS, Area } from '../types'

interface TaskFormProps {
  areas: Area[]
  onSubmit: (data: {
    area_ids: number[]
    title: string
    description: string
    priority: Priority
    deadline: string
  }) => void
  onClose: () => void
}

export default function TaskForm({ areas, onSubmit, onClose }: TaskFormProps) {
  const [form, setForm] = useState({
    area_ids: [areas[0]?.id] as number[],
    title: '',
    description: '',
    priority: 'PU' as Priority,
    deadline: '',
  })

  const toggleArea = (areaId: number) => {
    setForm((prev) => {
      const already = prev.area_ids.includes(areaId)
      // Minimal 1 area harus dipilih
      if (already && prev.area_ids.length === 1) return prev
      return {
        ...prev,
        area_ids: already
          ? prev.area_ids.filter((id) => id !== areaId)
          : [...prev.area_ids, areaId],
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.deadline || form.area_ids.length === 0) return
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Tambah Task Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Area — multi select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area Cabang
              <span className="ml-1 text-xs text-gray-400">(bisa pilih lebih dari 1)</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {areas.map((area) => {
                const selected = form.area_ids.includes(area.id)
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleArea(area.id)}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                      selected
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-black border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {selected ? '✓ ' : ''}{area.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Task</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="contoh: Laporan stok bulan ini"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detail tambahan..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`text-xs px-3 py-2 rounded-lg border font-semibold transition-all ${
                    form.priority === p
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-black border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {p} — {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Simpan Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}