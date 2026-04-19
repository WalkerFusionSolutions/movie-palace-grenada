'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, X, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Movie } from '@/lib/movies'

interface HeroTrailerProps {
  featuredMovie: Movie | null
  onBookTickets: (movieId: string) => void
}

function trailerSrc(url: string | null) {
  if (!url) return ''
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}autoplay=1&rel=0`
}

export function HeroTrailer({ featuredMovie, onBookTickets }: HeroTrailerProps) {
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)

  if (!featuredMovie) {
    return (
      <section className="relative min-h-[50vh] w-full overflow-hidden bg-[#141414] pt-16 md:pt-20">
        <div className="flex min-h-[40vh] items-center justify-center px-4 text-white/60">
          No featured film yet.
        </div>
      </section>
    )
  }

  const poster = featuredMovie.poster_url ?? ''

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden pt-16 md:pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: poster
            ? `url(${poster})`
            : 'linear-gradient(135deg,#222,#050505)',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-transparent to-[#0a0a0a]/60" />

      <div className="relative z-10 flex min-h-[90vh] flex-col items-start justify-center px-4 py-20 md:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-[#E50914] px-3 py-1 text-sm font-semibold text-white hover:bg-[#E50914]">
                Featured Film
              </Badge>

              <h1 className="mb-4 text-balance text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                {featuredMovie.title ?? 'Untitled'}
              </h1>

              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <Badge
                  variant="outline"
                  className="border-green-500/30 bg-green-500/20 text-green-400"
                >
                  {featuredMovie.rating ?? 'NR'}
                </Badge>
              </div>

              <p className="mb-8 max-w-lg text-pretty text-lg text-white/70">
                {featuredMovie.description ?? ''}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="glow-red bg-[#E50914] px-8 text-white hover:bg-[#E50914]/90"
                  onClick={() => onBookTickets(featuredMovie.id)}
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  Buy Tickets
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                  disabled={!featuredMovie.trailer_url}
                  onClick={() => setIsTrailerPlaying(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 inline-flex items-center gap-3 rounded-xl border border-[#F7B500]/30 bg-[#F7B500]/10 px-4 py-3"
              >
                <span className="text-2xl">🎟️</span>
                <div>
                  <p className="font-bold text-[#F7B500]">Super Saver Tuesdays!</p>
                  <p className="text-sm text-white/70">All tickets just $15 EC</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-video overflow-hidden rounded-2xl border border-white/10"
            >
              {isTrailerPlaying && featuredMovie.trailer_url ? (
                <div className="relative h-full w-full">
                  <iframe
                    src={trailerSrc(featuredMovie.trailer_url)}
                    title={`${featuredMovie.title ?? 'Movie'} Trailer`}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    type="button"
                    onClick={() => setIsTrailerPlaying(false)}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                    aria-label="Close trailer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => featuredMovie.trailer_url && setIsTrailerPlaying(true)}
                  className="group relative h-full w-full"
                  disabled={!featuredMovie.trailer_url}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: poster
                        ? `url(${poster})`
                        : 'linear-gradient(135deg,#333,#111)',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="glow-red flex h-20 w-20 items-center justify-center rounded-full bg-[#E50914] text-white shadow-2xl transition-transform group-hover:scale-110">
                      <Play className="h-8 w-8 translate-x-0.5" fill="currentColor" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    <Play className="h-4 w-4" />
                    Watch Official Trailer
                  </div>
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
