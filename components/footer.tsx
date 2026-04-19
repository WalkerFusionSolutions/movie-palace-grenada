'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Instagram, Facebook } from 'lucide-react'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] px-4 py-12 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Movie Palace Grenada"
                width={200}
                height={64}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-white/60">
              Your premier cinema destination in the Spice Isle. Experience movies the way they were meant to be seen.
            </p>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
              <MapPin className="h-5 w-5 text-[#E50914]" />
              Location
            </h4>
            <address className="not-italic text-sm text-white/60">
              <p className="mb-1 font-medium text-white">Excel Plaza</p>
              <p>Grand Anse</p>
              <p>St. George&apos;s, Grenada</p>
            </address>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
              <Clock className="h-5 w-5 text-[#E50914]" />
              Opening Hours
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Tuesday - Sunday</span>
                <span className="text-white">4:00 PM - Late</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-[#E50914]/10 px-3 py-2 text-[#E50914]">
                <span className="text-sm font-medium">Closed on Mondays</span>
              </div>
            </div>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
              <Phone className="h-5 w-5 text-[#E50914]" />
              Connect
            </h4>
            <div className="space-y-3">
              <a 
                href="tel:+14734446688" 
                className="block text-sm text-white/60 transition-colors hover:text-white"
              >
                +1 (473) 444-6688
              </a>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/moviepalacegrenada/"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-all hover:bg-[#E50914] hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/p/Movie-Palace-Grenada-100063665376008/"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-all hover:bg-[#E50914] hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 md:flex-row"
        >
          <p>© 2026 Excel Plaza. All rights reserved.</p>
          <p>Made with ❤️ in Grenada</p>
        </motion.div>
      </div>
    </footer>
  )
}
