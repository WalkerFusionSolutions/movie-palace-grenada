import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { normalizeMovieRow } from '@/lib/movies'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: movies, error: moviesError } = await supabase
    .from('movies')
    .select(
      'id,title,description,poster_url,trailer_url,is_now_playing,is_coming_soon,rating'
    )
    .order('title', { ascending: true })

  const { data: showtimes, error: showtimesError } = await supabase
    .from('showtimes')
    .select('id,movie_id,start_time,is_3d')
    .order('start_time', { ascending: true })

  if (moviesError || showtimesError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4 text-center">
        <p className="text-lg text-white/80">Could not load admin data.</p>
        <p className="mt-2 max-w-md text-sm text-white/50">
          {moviesError?.message ?? showtimesError?.message}
        </p>
        <p className="mt-4 text-xs text-white/40">
          Ensure Row Level Security allows authenticated users to read/write
          `movies` and `showtimes`, or sign in with a manager account.
        </p>
      </div>
    )
  }

  const normalizedMovies = (movies ?? []).map((m) =>
    normalizeMovieRow(m as Record<string, unknown>)
  )

  return (
    <AdminDashboard
      initialMovies={normalizedMovies}
      initialShowtimes={showtimes ?? []}
    />
  )
}
