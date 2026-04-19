'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, BellRing, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Movie } from '@/lib/movies'

interface MovieCardProps {
  movie: Movie
  selectedDate: string
  showtimes: string[]
  index: number
}

export function MovieCard({
  movie,
  selectedDate,
  showtimes,
  index,
}: MovieCardProps) {
  const [reminders, setReminders] = useState<Set<string>>(new Set())
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const handleReminder = (time: string) => {
    const key = `${movie.id}-${time}`

    setReminders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
        setJustAdded(key)
        setTimeout(() => setJustAdded(null), 1500)

        const movieDate = new Date(selectedDate)
        const [timePart, period] = time.split(' ')
        const [hours, minutes] = timePart.split(':').map(Number)
        let hour24 = hours
        if (period === 'PM' && hours !== 12) hour24 += 12
        if (period === 'AM' && hours === 12) hour24 = 0

        movieDate.setHours(hour24, minutes)

        const endDate = new Date(movieDate)
        endDate.setHours(endDate.getHours() + 2)

        const formatDate = (d: Date) =>
          d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

        const title = movie.title ?? 'Movie'
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title + ' at Movie Palace')}&dates=${formatDate(movieDate)}/${formatDate(endDate)}&details=${encodeURIComponent('Movie: ' + title + '\nLocation: Movie Palace Grenada, Excel Plaza')}&location=${encodeURIComponent('Excel Plaza, Grand Anse, Grenada')}`

        window.open(calendarUrl, '_blank')
      }
      return newSet
    })
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'G':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'PG':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'PG-13':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'R':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (showtimes.length === 0) return null

  const rating = movie.rating ?? 'NR'
  const poster = movie.poster_url ?? ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card overflow-hidden rounded-2xl"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 w-full sm:h-auto sm:w-36 md:w-44 lg:w-52">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: poster
                ? `url(${poster})`
                : 'linear-gradient(135deg,#333,#111)',
            }}
          />
          <div className="glass absolute inset-x-0 bottom-0 p-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className={`${getRatingColor(rating)} text-xs font-bold`}
              >
                {rating}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 md:p-5">
          <div className="mb-3">
            <h3 className="mb-1 text-xl font-bold text-white md:text-2xl">
              {movie.title ?? 'Untitled'}
            </h3>
          </div>

          <p className="mb-4 line-clamp-2 text-sm text-white/60">
            {movie.description ?? ''}
          </p>

          <div className="mt-auto">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/50">
              Showtimes
            </p>
            <div className="flex flex-wrap gap-2">
              {showtimes.map((time) => {
                const key = `${movie.id}-${time}`
                const hasReminder = reminders.has(key)
                const isJustAdded = justAdded === key

                return (
                  <div key={time} className="group relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-10 border-white/20 bg-white/5 pr-10 text-white transition-all hover:border-[#E50914] hover:bg-[#E50914]/20 hover:text-white ${
                        hasReminder ? 'border-[#F7B500]/50 bg-[#F7B500]/10' : ''
                      }`}
                    >
                      {time}
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleReminder(time)}
                      className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition-all ${
                        hasReminder
                          ? 'text-[#F7B500]'
                          : 'text-white/40 hover:text-[#F7B500]'
                      }`}
                      title={hasReminder ? 'Remove reminder' : 'Add to calendar'}
                      aria-label={
                        hasReminder ? 'Remove reminder' : 'Add to calendar'
                      }
                    >
                      {isJustAdded ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <Check className="h-4 w-4 text-green-400" />
                        </motion.div>
                      ) : hasReminder ? (
                        <BellRing className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
