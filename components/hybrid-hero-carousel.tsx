'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Play, X, Ticket, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Movie } from '@/lib/movies'

interface HybridHeroCarouselProps {
  featuredMovies: Movie[]
  onBookTickets: (movieId: string) => void
}

function trailerSrc(url: string | null) {
  if (!url) return ''
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}autoplay=1&rel=0`
}

export function HybridHeroCarousel({
  featuredMovies,
  onBookTickets,
}: HybridHeroCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)
  const [showArrows, setShowArrows] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: featuredMovies.length > 1, duration: 30 },
    [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setIsTrailerPlaying(false)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const currentMovie = featuredMovies[selectedIndex]

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

  const getStatusBadge = (index: number) => {
    if (index === featuredMovies.length - 1 && featuredMovies.length >= 3) {
      return { text: 'LAST CHANCE', color: 'bg-amber-600' }
    }
    return { text: 'NOW PLAYING', color: 'bg-[#E50914]' }
  }

  if (featuredMovies.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-[#141414] px-4 pb-24 pt-28 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Welcome to <span className="text-[#E50914]">Movie Palace</span>
          </h1>
          <p className="mt-4 text-white/60">
            Showtimes will appear here once films are added in the admin panel.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative w-full overflow-hidden pt-16 md:pt-20"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {featuredMovies.map((movie, index) => {
            const status = getStatusBadge(index)
            const rating = movie.rating ?? 'NR'
            const poster = movie.poster_url ?? ''
            return (
              <div
                key={movie.id}
                className="relative min-h-[90vh] w-full flex-shrink-0 flex-grow-0 basis-full"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms]"
                  style={{
                    backgroundImage: poster
                      ? `url(${poster})`
                      : 'linear-gradient(135deg,#222,#050505)',
                    transform: selectedIndex === index ? 'scale(1.05)' : 'scale(1)',
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

                <div className="relative z-10 flex min-h-[90vh] items-center">
                  <div className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 lg:px-16">
                    <div className="max-w-2xl">
                      <AnimatePresence mode="wait">
                        {selectedIndex === index && (
                          <motion.div
                            key={movie.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.5 }}
                            >
                              <Badge
                                className={`mb-4 ${status.color} px-3 py-1.5 text-xs font-bold tracking-wider text-white hover:${status.color}`}
                              >
                                {status.text}
                              </Badge>
                            </motion.div>

                            <motion.h1
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.6 }}
                              className="mb-4 text-balance text-4xl font-black tracking-tight text-white md:text-5xl lg:text-7xl"
                              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
                            >
                              {movie.title ?? 'Untitled'}
                            </motion.h1>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className="mb-4 flex flex-wrap items-center gap-3 text-sm"
                            >
                              <Badge
                                variant="outline"
                                className={getRatingColor(rating)}
                              >
                                {rating}
                              </Badge>
                              <span className="flex items-center gap-1.5 text-white/80">
                                <Clock className="h-4 w-4" />
                                Now at Movie Palace
                              </span>
                            </motion.div>

                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                              className="mb-8 max-w-lg text-pretty text-lg leading-relaxed text-white/70"
                            >
                              {movie.description ?? ''}
                            </motion.p>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                              className="flex flex-wrap gap-4"
                            >
                              <Button
                                size="lg"
                                className="bg-[#E50914] px-8 py-6 text-lg font-semibold text-white shadow-[0_0_30px_rgba(229,9,20,0.4)] transition-all hover:bg-[#E50914]/90 hover:shadow-[0_0_40px_rgba(229,9,20,0.6)]"
                                onClick={() => onBookTickets(movie.id)}
                              >
                                <Ticket className="mr-2 h-5 w-5" />
                                Book Tickets
                              </Button>
                              <Button
                                size="lg"
                                variant="outline"
                                className="border-white/20 bg-white/5 px-8 py-6 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
                                disabled={!movie.trailer_url}
                                onClick={() => setIsTrailerPlaying(true)}
                              >
                                <Play className="mr-2 h-5 w-5" />
                                Watch Trailer
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {featuredMovies.length > 1 && (
        <AnimatePresence>
          {showArrows && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/70 md:left-8"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onClick={scrollNext}
                className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/70 md:right-8"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      )}

      {featuredMovies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? 'w-8 bg-[#E50914]'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-8 right-4 z-20 text-sm text-white/50 md:right-8">
        <span className="font-medium text-white">
          {String(selectedIndex + 1).padStart(2, '0')}
        </span>
        <span className="mx-1">/</span>
        <span>{String(featuredMovies.length).padStart(2, '0')}</span>
      </div>

      <AnimatePresence>
        {isTrailerPlaying && currentMovie?.trailer_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setIsTrailerPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative mx-4 aspect-video w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={trailerSrc(currentMovie.trailer_url)}
                title={`${currentMovie.title ?? 'Movie'} Trailer`}
                className="h-full w-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                type="button"
                onClick={() => setIsTrailerPlaying(false)}
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Close trailer"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
