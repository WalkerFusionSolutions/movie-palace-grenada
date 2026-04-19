import { createClient } from '@/lib/supabase/server'
import { HomeClient } from './home-client'
import { normalizeMovieRow, type ShowtimeRow } from '@/lib/movies'

export const revalidate = 0

export default async function HomePage() {
  const supabase = await createClient()

  const { data: nowRows, error: nowError } = await supabase
    .from('movies')
    .select('*')
    .eq('is_now_playing', true)
    .order('title', { ascending: true })

  const { data: soonRows, error: soonError } = await supabase
    .from('movies')
    .select('*')
    .eq('is_coming_soon', true)
    .order('title', { ascending: true })

  const nowPlaying = (nowRows ?? []).map((r) => normalizeMovieRow(r as Record<string, unknown>))
  const comingSoon = (soonRows ?? []).map((r) => normalizeMovieRow(r as Record<string, unknown>))

  const movieIds = nowPlaying.map((m) => m.id)

  let showtimes: ShowtimeRow[] = []
  if (movieIds.length > 0) {
    const { data: stRows, error: stError } = await supabase
      .from('showtimes')
      .select('id,movie_id,start_time,is_3d')
      .in('movie_id', movieIds)
      .order('start_time', { ascending: true })

    if (stError) {
      console.error('showtimes fetch:', stError.message)
    } else {
      showtimes = (stRows ?? []) as ShowtimeRow[]
    }
  }

  if (nowError) {
    console.error('now playing fetch:', nowError.message)
  }
  if (soonError) {
    console.error('coming soon fetch:', soonError.message)
  }

  return (
    <HomeClient
      nowPlaying={nowError ? [] : nowPlaying}
      comingSoon={soonError ? [] : comingSoon}
      showtimes={showtimes}
    />
  )
}
