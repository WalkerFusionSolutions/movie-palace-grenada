'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Movie } from '@/lib/movies'

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const featuredMovies = movies.slice(0, 3)

  const next = useCallback(() => {
    if (featuredMovies.length === 0) return
    setCurrent((prev) => (prev + 1) % featuredMovies.length)
  }, [featuredMovies.length])

  const prev = () => {
    if (featuredMovies.length === 0) return
    setCurrent(
      (p) => (p - 1 + featuredMovies.length) % featuredMovies.length
    )
  }

  useEffect(() => {
    if (!isAutoPlaying || featuredMovies.length === 0) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, next, featuredMovies.length])

  if (featuredMovies.length === 0) {
    return (
      <section className="relative flex min-h-[400px] items-center justify-center bg-[#141414]">
        <p className="text-white/60">No films to feature.</p>
      </section>
    )
  }

  const movie = featuredMovies[current]
  const poster = movie.poster_url ?? ''

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: poster
                ? `url(${poster})`
                : 'linear-gradient(135deg,#222,#050505)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-16 md:px-8 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="mb-4 bg-[#E50914] px-3 py-1 text-sm font-semibold text-white hover:bg-[#E50914]">
                Now Showing
              </Badge>
            </motion.div>

            <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
              {movie.title ?? 'Untitled'}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <Badge variant="outline" className="border-white/30 text-white">
                {movie.rating ?? 'NR'}
              </Badge>
            </div>

            <p className="mb-8 max-w-lg text-lg text-white/70">
              {movie.description ?? ''}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                disabled={!movie.trailer_url}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Trailer
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-8 right-4 flex items-center gap-4 md:right-8 lg:right-16">
          <button
            type="button"
            onClick={prev}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex gap-2">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === current
                    ? 'w-8 bg-[#E50914]'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="absolute left-4 top-6 z-20 md:left-8 lg:left-16">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E50914]">
            <span className="text-2xl font-black text-white">MP</span>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-lg font-bold leading-tight text-white">Movie Palace</h2>
            <p className="text-xs text-[#F7B500]">Grenada</p>
          </div>
        </div>
      </div>
    </section>
  )
}
