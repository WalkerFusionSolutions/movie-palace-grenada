'use client'

import { motion } from 'framer-motion'
import { Clock, Ticket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { movies } from '@/lib/movies'

interface NowPlayingProps {
  onBookTickets: (movieId: string) => void
}

export function NowPlaying({ onBookTickets }: NowPlayingProps) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'G': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'PG': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'PG-13': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'R': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
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

        {/* Movie Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#141414]"
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${movie.poster})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                
                {/* Rating Badge */}
                <Badge 
                  variant="outline" 
                  className={`absolute right-3 top-3 ${getRatingColor(movie.rating)} text-xs font-bold`}
                >
                  {movie.rating}
                </Badge>

                {/* Hover Overlay */}
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

              {/* Info */}
              <div className="p-4">
                <h3 className="mb-1 line-clamp-1 text-lg font-bold text-white">
                  {movie.title}
                </h3>
                <p className="mb-2 text-sm text-[#F7B500]">{movie.genre}</p>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration}</span>
                </div>
              </div>

              {/* Mobile Buy Button */}
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
          ))}
        </div>
      </div>
    </section>
  )
}
