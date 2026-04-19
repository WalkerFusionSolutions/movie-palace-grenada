'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { HybridHeroCarousel } from '@/components/hybrid-hero-carousel'
import { NowPlaying } from '@/components/now-playing'
import { ComingSoon } from '@/components/coming-soon'
import { PricingSection } from '@/components/pricing-section'
import { WhatsAppShare } from '@/components/whatsapp-share'
import { Footer } from '@/components/footer'
import { BookingModal } from '@/components/booking-modal'
import type { Movie, ShowtimeRow } from '@/lib/movies'
import { groupShowtimesByMovieDate } from '@/lib/movies'

export type HomeClientProps = {
  nowPlaying: Movie[]
  comingSoon: Movie[]
  showtimes: ShowtimeRow[]
}

export function HomeClient({
  nowPlaying,
  comingSoon,
  showtimes,
}: HomeClientProps) {
  const [bookingMovieId, setBookingMovieId] = useState<string | null>(null)
  const showtimesByMovie = groupShowtimesByMovieDate(showtimes)

  const handleBookTickets = (movieId: string) => {
    setBookingMovieId(movieId)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <HybridHeroCarousel
        featuredMovies={nowPlaying.slice(0, 3)}
        onBookTickets={handleBookTickets}
      />

      <NowPlaying movies={nowPlaying} onBookTickets={handleBookTickets} />

      <ComingSoon movies={comingSoon} />

      <PricingSection />

      <Footer />

      <WhatsAppShare />

      <BookingModal
        isOpen={bookingMovieId !== null}
        onClose={() => setBookingMovieId(null)}
        movieId={bookingMovieId}
        movies={nowPlaying}
        showtimesByMovie={showtimesByMovie}
      />
    </main>
  )
}
