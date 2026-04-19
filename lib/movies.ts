/** Row shape for `public.movies` (Supabase). */
export interface Movie {
  id: string
  title: string | null
  description: string | null
  poster_url: string | null
  trailer_url: string | null
  is_now_playing: boolean
  is_coming_soon: boolean
  rating: string | null
  showtime_display: string | null
}

/** Row shape for `public.showtimes` (Supabase). */
export interface ShowtimeRow {
  id: string
  movie_id: string
  start_time: string
  is_3d: boolean
}

export function formatDateKey(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function formatShowtimeLabel(d: Date) {
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/** Group showtimes by movie id, then by local calendar date (YYYY-MM-DD). */
export function groupShowtimesByMovieDate(
  showtimes: ShowtimeRow[]
): Record<string, Record<string, string[]>> {
  const result: Record<string, Record<string, string[]>> = {}
  for (const s of showtimes) {
    const start = new Date(s.start_time)
    const dateKey = formatDateKey(start)
    const timeLabel = formatShowtimeLabel(start)
    const label = s.is_3d ? `${timeLabel} (3D)` : timeLabel
    result[s.movie_id] ??= {}
    result[s.movie_id][dateKey] ??= []
    result[s.movie_id][dateKey].push(label)
  }
  return result
}

export function normalizeMovieRow(m: Record<string, unknown>): Movie {
  return {
    id: String(m.id),
    title: (m.title as string) ?? null,
    description: (m.description as string) ?? null,
    poster_url: (m.poster_url as string) ?? null,
    trailer_url: (m.trailer_url as string) ?? null,
    is_now_playing: Boolean(m.is_now_playing),
    is_coming_soon: Boolean(m.is_coming_soon),
    rating: (m.rating as string) ?? null,
    showtime_display: (m.showtime_display as string) ?? null,
  }
}

// Static schedule dates to avoid hydration mismatch
export const scheduleDates = [
  { date: '2026-04-18', dayName: 'Fri', dayNumber: 18, month: 'Apr', isToday: true },
  { date: '2026-04-19', dayName: 'Sat', dayNumber: 19, month: 'Apr', isToday: false },
  { date: '2026-04-20', dayName: 'Sun', dayNumber: 20, month: 'Apr', isToday: false },
  { date: '2026-04-22', dayName: 'Tue', dayNumber: 22, month: 'Apr', isToday: false },
  { date: '2026-04-23', dayName: 'Wed', dayNumber: 23, month: 'Apr', isToday: false },
  { date: '2026-04-24', dayName: 'Thu', dayNumber: 24, month: 'Apr', isToday: false },
]

export const getScheduleDates = () => scheduleDates
