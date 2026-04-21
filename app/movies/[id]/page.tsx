import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { normalizeMovieRow } from '@/lib/movies'

type MovieDetailsPageProps = {
  params: Promise<{ id: string }>
}

export const revalidate = 0

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  const movie = normalizeMovieRow(data as Record<string, unknown>)
  const rawMovie = data as Record<string, unknown>
  const duration = (rawMovie.duration as string) || (rawMovie.duration_minutes as string) || null
  const genre = (rawMovie.genre as string) || null

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      <div
        className="absolute inset-0 bg-cover bg-center blur-2xl"
        style={{
          backgroundImage: movie.poster_url
            ? `url(${movie.poster_url})`
            : 'linear-gradient(135deg,#141414,#060606)',
        }}
      />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 px-4 pb-16 pt-[156px] md:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
          >
            <span aria-hidden>←</span>
            Back to Home
          </Link>

          <section className="rounded-2xl border border-white/15 bg-black/45 p-6 backdrop-blur-sm md:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_1fr] lg:items-start">
              <div className="overflow-hidden rounded-xl border border-white/20 shadow-[0_0_35px_rgba(229,9,20,0.3)]">
                <div
                  className="aspect-[2/3] w-full bg-cover bg-center"
                  style={{
                    backgroundImage: movie.poster_url
                      ? `url(${movie.poster_url})`
                      : 'linear-gradient(135deg,#1f1f1f,#080808)',
                  }}
                />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-[#E50914] md:text-6xl">
                  {movie.title ?? 'Untitled'}
                </h1>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                    {movie.rating ?? 'NR'}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                    {duration ?? 'Duration TBA'}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                    {genre ?? 'Genre TBA'}
                  </span>
                </div>

                <div className="mt-6 rounded-xl border border-[#E50914]/40 bg-[#E50914]/20 px-4 py-3">
                  <p className="text-lg font-bold text-white">
                    Showtimes: {movie.showtime_display ?? 'To be announced'}
                  </p>
                </div>

                <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-base leading-8 text-white/80">
                  {movie.description ?? 'Description coming soon.'}
                </p>
              </div>
            </div>
          </section>

          {movie.trailer_url && (
            <section className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black/70">
              <div className="aspect-video w-full">
                <iframe
                  src={movie.trailer_url}
                  title={`${movie.title ?? 'Movie'} Trailer`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
