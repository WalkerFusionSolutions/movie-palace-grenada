'use client'

import { Header } from '@/components/header'
import { HybridHeroCarousel } from '@/components/hybrid-hero-carousel'
import { NowPlaying } from '@/components/now-playing'
import { ComingSoon } from '@/components/coming-soon'
import { PricingSection } from '@/components/pricing-section'
import { WhatsAppShare } from '@/components/whatsapp-share'
import { Footer } from '@/components/footer'
import type { Movie } from '@/lib/movies'

export type HomeClientProps = {
  nowPlaying: Movie[]
  comingSoon: Movie[]
}

export function HomeClient({ nowPlaying, comingSoon }: HomeClientProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <HybridHeroCarousel featuredMovies={nowPlaying} />

      <NowPlaying movies={nowPlaying} />

      <ComingSoon movies={comingSoon} />

      <PricingSection />

      <Footer />

      <WhatsAppShare />
    </main>
  )
}
