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

export default function HomePage() {
  const [bookingMovieId, setBookingMovieId] = useState<string | null>(null)

  const handleBookTickets = (movieId: string) => {
    setBookingMovieId(movieId)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Sticky Header */}
      <Header />
      
      {/* Hybrid Hero Carousel */}
      <HybridHeroCarousel onBookTickets={handleBookTickets} />
      
      {/* Now Playing Section */}
      <NowPlaying onBookTickets={handleBookTickets} />
      
      {/* Coming Soon Section */}
      <ComingSoon />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Footer */}
      <Footer />
      
      {/* Floating WhatsApp Share */}
      <WhatsAppShare />

      {/* Booking Modal */}
      <BookingModal 
        isOpen={bookingMovieId !== null}
        onClose={() => setBookingMovieId(null)}
        movieId={bookingMovieId}
      />
    </main>
  )
}
