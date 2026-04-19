'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import type { Movie } from '@/lib/movies'

interface MovieCardProps {
  movie: Movie
  index: number
}

export function MovieCard({ movie, index }: MovieCardProps) {
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

  const rating = movie.rating ?? 'NR'
  const poster = movie.poster_url ?? ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card overflow-hidden rounded-2xl"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 w-full sm:h-auto sm:w-36 md:w-44 lg:w-52">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: poster
                ? `url(${poster})`
                : 'linear-gradient(135deg,#333,#111)',
            }}
          />
          <div className="glass absolute inset-x-0 bottom-0 p-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className={`${getRatingColor(rating)} text-xs font-bold`}
              >
                {rating}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 md:p-5">
          <div className="mb-3">
            <h3 className="mb-1 text-xl font-bold text-white md:text-2xl">
              {movie.title ?? 'Untitled'}
            </h3>
          </div>

          <p className="mb-4 line-clamp-2 text-sm text-white/60">
            {movie.description ?? ''}
          </p>

          <div className="mt-auto">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/50">
              Showtimes
            </p>
            <div className="rounded-lg border border-[#F7B500]/30 bg-[#F7B500]/10 px-3 py-2 text-sm font-semibold text-[#F7B500]">
              {movie.showtime_display ?? 'Showtimes will be announced soon'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
