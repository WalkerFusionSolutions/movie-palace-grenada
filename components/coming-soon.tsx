'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Movie } from '@/lib/movies'
import Link from 'next/link'

interface ComingSoonProps {
  movies: Movie[]
}

export function ComingSoon({ movies }: ComingSoonProps) {
  if (movies.length === 0) {
    return (
      <section
        id="coming-soon"
        className="bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] px-4 py-16 md:px-8 lg:px-16"
      >
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Coming <span className="text-[#F7B500]">Soon</span>
          </h2>
          <p className="text-white/60">No upcoming titles listed yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="coming-soon"
      className="bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] px-4 py-16 md:px-8 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Coming <span className="text-[#F7B500]">Soon</span>
          </h2>
          <p className="text-white/60">Upcoming titles at Movie Palace</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie, index) => {
            const poster = movie.poster_url ?? ''
            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Link
                  href={`/movies/${movie.id}`}
                  className="group relative block overflow-hidden rounded-xl border border-white/10 bg-[#141414]"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                      style={{
                        backgroundImage: poster
                          ? `url(${poster})`
                          : 'linear-gradient(135deg,#333,#111)',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />

                    <Badge className="absolute right-3 top-3 border-[#F7B500]/30 bg-[#F7B500]/20 text-[#F7B500]">
                      <Calendar className="mr-1 h-3 w-3" />
                      Coming Soon
                    </Badge>
                  </div>

                  <div className="p-4">
                    <h3 className="mb-1 line-clamp-1 text-lg font-bold text-white">
                      {movie.title ?? 'Untitled'}
                    </h3>
                    {movie.rating && (
                      <p className="mb-2 text-sm text-[#F7B500]">{movie.rating}</p>
                    )}
                    <p className="mb-2 line-clamp-2 text-sm text-white/50">
                      {movie.description ?? ''}
                    </p>
                    <p className="text-sm font-medium text-[#F7B500]">
                      Expected: {movie.showtime_display ?? 'Coming soon'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
