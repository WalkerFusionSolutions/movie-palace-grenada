'use client'

import { motion } from 'framer-motion'
import { Ticket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Movie } from '@/lib/movies'

interface NowPlayingProps {
  movies: Movie[]
  onBookTickets: (movieId: string) => void
}

export function NowPlaying({ movies, onBookTickets }: NowPlayingProps) {
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

  if (movies.length === 0) {
    return (
      <section id="now-playing" className="px-4 py-16 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Now <span className="text-[#E50914]">Playing</span>
          </h2>
          <p className="text-white/60">No films listed right now. Check back soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="now-playing" className="px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Now <span className="text-[#E50914]">Playing</span>
          </h2>
          <p className="text-white/60">Currently showing at Movie Palace Grenada</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie, index) => {
            const rating = movie.rating ?? 'NR'
            const poster = movie.poster_url ?? ''
            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#141414]"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: poster
                        ? `url(${poster})`
                        : 'linear-gradient(135deg,#333,#111)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

                  <Badge
                    variant="outline"
                    className={`absolute right-3 top-3 ${getRatingColor(rating)} text-xs font-bold`}
                  >
                    {rating}
                  </Badge>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="lg"
                      className="bg-[#E50914] text-white hover:bg-[#E50914]/90 glow-red"
                      onClick={() => onBookTickets(movie.id)}
                    >
                      <Ticket className="mr-2 h-5 w-5" />
                      Buy Tickets
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="mb-1 line-clamp-2 text-lg font-bold text-white">
                    {movie.title ?? 'Untitled'}
                  </h3>
                  {movie.description && (
                    <p className="mb-2 line-clamp-2 text-sm text-white/50">
                      {movie.description}
                    </p>
                  )}
                </div>

                <div className="border-t border-white/10 p-4 lg:hidden">
                  <Button
                    className="w-full bg-[#E50914] text-white hover:bg-[#E50914]/90"
                    onClick={() => onBookTickets(movie.id)}
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    Buy Tickets
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
