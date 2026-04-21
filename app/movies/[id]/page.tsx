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

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 pb-16 pt-[180px] md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="mb-6 inline-block text-sm font-semibold text-white/70 underline">
          Back to home
        </Link>

        <section className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_1fr] lg:items-start">
            <div className="overflow-hidden rounded-xl border border-white/10">
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

              <p className="mt-5 text-xl font-bold text-[#F7B500]">
                Showtimes: {movie.showtime_display ?? 'To be announced'}
              </p>

              <p className="mt-6 text-base leading-8 text-white/75">
                {movie.description ?? 'Description coming soon.'}
              </p>
            </div>
          </div>
        </section>

        {movie.trailer_url && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
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
    </main>
  )
}
