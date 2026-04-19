'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DatePicker } from './date-picker'
import { MovieCard } from './movie-card'
import {
  getScheduleDates,
  groupShowtimesByMovieDate,
  normalizeMovieRow,
  type Movie,
  type ShowtimeRow,
} from '@/lib/movies'
import { supabase } from '@/lib/supabase/client'

export function MovieSchedule() {
  const dates = getScheduleDates()
  const [selectedDate, setSelectedDate] = useState(dates[0]?.date || '')
  const [movies, setMovies] = useState<Movie[]>([])
  const [showtimesByMovie, setShowtimesByMovie] = useState<
    Record<string, Record<string, string[]>>
  >({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      const { data: dbMovies, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .eq('is_now_playing', true)
        .order('title', { ascending: true })

      if (moviesError) {
        if (!isCancelled) {
          setMovies([])
          setShowtimesByMovie({})
          setError(moviesError.message)
          setIsLoading(false)
        }
        return
      }

      const mapped = (dbMovies ?? []).map((r) =>
        normalizeMovieRow(r as Record<string, unknown>)
      )

      const movieIds = mapped.map((m) => m.id)

      let rows: ShowtimeRow[] = []
      if (movieIds.length > 0) {
        const { data: dbShowtimes, error: showtimesError } = await supabase
          .from('showtimes')
          .select('id,movie_id,start_time,is_3d')
          .in('movie_id', movieIds)
          .order('start_time', { ascending: true })

        if (showtimesError) {
          if (!isCancelled) {
            setMovies([])
            setShowtimesByMovie({})
            setError(showtimesError.message)
            setIsLoading(false)
          }
          return
        }
        rows = (dbShowtimes ?? []) as ShowtimeRow[]
      }

      if (!isCancelled) {
        setMovies(mapped)
        setShowtimesByMovie(groupShowtimesByMovieDate(rows))
        setIsLoading(false)
      }
    }

    load()

    return () => {
      isCancelled = true
    }
  }, [])

  const moviesWithShowtimes = useMemo(
    () =>
      movies.filter(
        (movie) => showtimesByMovie[movie.id]?.[selectedDate]?.length ?? 0 > 0
      ),
    [movies, selectedDate, showtimesByMovie]
  )

  return (
    <section id="schedule" className="px-4 py-12 md:px-8 lg:px-16">
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

      <div className="mb-8">
        <DatePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

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
              showtimes={showtimesByMovie[movie.id]?.[selectedDate] ?? []}
              index={index}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <p className="text-lg text-white/60">
              No showtimes available for this date
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
