import { createClient } from '@/lib/supabase/server'
import { HomeClient } from './home-client'
import { normalizeMovieRow } from '@/lib/movies'

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
    />
  )
}
