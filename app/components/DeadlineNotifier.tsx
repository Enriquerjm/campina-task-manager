'use client'

import { useEffect } from 'react'
import { Task } from '../types'

interface DeadlineNotifierProps {
  tasks: Task[]
}

export default function DeadlineNotifier({ tasks }: DeadlineNotifierProps) {
  useEffect(() => {
    if (tasks.length === 0) return
    requestAndNotify(tasks)
  }, [tasks])

  const requestAndNotify = async (tasks: Task[]) => {
    // Cek apakah browser support notifikasi
    if (!('Notification' in window)) return

    // Minta izin kalau belum
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }

    // Kalau ditolak, stop
    if (Notification.permission !== 'granted') return

    // Cari task yang deadlinenya kurang dari 2 hari dan belum selesai
    const now = new Date()
    const twoDaysFromNow = new Date()
    twoDaysFromNow.setDate(now.getDate() + 2)

    const urgentTasks = tasks.filter((task) => {
      const deadline = new Date(task.deadline)
      return deadline <= twoDaysFromNow && task.status !== 'done'
    })

    if (urgentTasks.length === 0) return

    // Tampilkan notifikasi setelah 3 detik buka website
    setTimeout(() => {
      urgentTasks.forEach((task) => {
        const deadline = new Date(task.deadline)
        const isToday = deadline.toDateString() === now.toDateString()
        const isTomorrow =
          deadline.toDateString() ===
          new Date(now.getTime() + 86400000).toDateString()
        const isOverdue = deadline < now

        let timeText = ''
        if (isOverdue) timeText = '⚠️ Sudah melewati deadline!'
        else if (isToday) timeText = '⏰ Deadline hari ini!'
        else if (isTomorrow) timeText = '📅 Deadline besok!'
        else timeText = '📅 Deadline dalam 2 hari'

        new Notification(`${timeText}`, {
          body: task.title,
          icon: '/favicon.ico',
          tag: `task-${task.id}`, // mencegah duplikat notifikasi
        })
      })
    }, 3000)
  }

  return null // komponen ini tidak render apapun
}