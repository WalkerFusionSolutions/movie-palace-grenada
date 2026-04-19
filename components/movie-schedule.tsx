'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DatePicker } from './date-picker'
import { MovieCard } from './movie-card'
import { getScheduleDates, type Movie } from '@/lib/movies'
import { supabase } from '@/lib/supabase/client'

type DbMovie = {
  id: string
  title: string | null
  description: string | null
  poster_url: string | null
  rating: string | null
}

type DbShowtime = {
  movie_id: string
  start_time: string
  is_3d: boolean
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDateKey(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function MovieSchedule() {
  const dates = getScheduleDates()
  const [selectedDate, setSelectedDate] = useState(dates[0]?.date || '')
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      const { data: dbMovies, error: moviesError } = await supabase
        .from('movies')
        .select('id,title,description,poster_url,rating')
        .eq('is_now_playing', true)
        .order('title', { ascending: true })
        .returns<DbMovie[]>()

      if (moviesError) {
        if (!isCancelled) {
          setMovies([])
          setError(moviesError.message)
          setIsLoading(false)
        }
        return
      }

      const movieIds = (dbMovies ?? [])
        .map((m) => m.id)
        .filter((id): id is string => Boolean(id))

      const { data: dbShowtimes, error: showtimesError } = await supabase
        .from('showtimes')
        .select('movie_id,start_time,is_3d')
        .in('movie_id', movieIds.length > 0 ? movieIds : ['00000000-0000-0000-0000-000000000000'])
        .order('start_time', { ascending: true })
        .returns<DbShowtime[]>()

      if (showtimesError) {
        if (!isCancelled) {
          setMovies([])
          setError(showtimesError.message)
          setIsLoading(false)
        }
        return
      }

      const showtimesByMovie: Record<string, Record<string, string[]>> = {}
      for (const s of dbShowtimes ?? []) {
        const start = new Date(s.start_time)
        const dateKey = formatDateKey(start)
        const timeLabel = formatTime(start)

        showtimesByMovie[s.movie_id] ??= {}
        showtimesByMovie[s.movie_id][dateKey] ??= []
        showtimesByMovie[s.movie_id][dateKey].push(timeLabel)
      }

      const mapped: Movie[] = (dbMovies ?? []).map((m) => ({
        id: m.id,
        title: m.title ?? 'Untitled',
        poster: m.poster_url ?? '',
        rating: (m.rating as Movie['rating']) ?? 'PG',
        duration: '',
        genre: '',
        description: m.description ?? '',
        trailer: '',
        showtimes: showtimesByMovie[m.id] ?? {},
      }))

      if (!isCancelled) {
        setMovies(mapped)
        setIsLoading(false)
      }
    }

    load()

    return () => {
      isCancelled = true
    }
  }, [])

  const moviesWithShowtimes = useMemo(
    () => movies.filter((movie) => movie.showtimes[selectedDate]?.length > 0),
    [movies, selectedDate]
  )

  return (
    <section className="px-4 py-12 md:px-8 lg:px-16" id="schedule">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          What&apos;s <span className="text-[#E50914]">Playing</span>
        </h2>
        <p className="text-white/60">Select a date to see available showtimes</p>
      </motion.div>

      {/* Date Picker */}
      <div className="mb-8">
        <DatePicker 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
        />
      </div>

      {/* Movie List */}
      <div className="mx-auto max-w-4xl space-y-6">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <p className="text-lg text-white/60">Loading...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <p className="text-lg text-white/60">Failed to load showtimes.</p>
            <p className="mt-2 break-words text-sm text-white/40">{error}</p>
          </motion.div>
        ) : moviesWithShowtimes.length > 0 ? (
          moviesWithShowtimes.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              selectedDate={selectedDate}
              index={index}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <p className="text-lg text-white/60">No showtimes available for this date</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
