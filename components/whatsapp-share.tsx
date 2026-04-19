'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function WhatsAppShare() {
  const [isExpanded, setIsExpanded] = useState(false)

  const shareMessage = encodeURIComponent(
    `🎬 Let's go to Movie Palace Grenada!\n\n` +
    `📍 Excel Plaza, Grand Anse\n` +
    `🕓 Open 4:00 PM - Late (Closed Mondays)\n\n` +
    `💰 Super Saver Tuesdays - $15 EC!\n` +
    `🎟️ Regular: Adults $25 EC / Kids $15 EC\n\n` +
    `Check out what's playing and book your tickets!`
  )

  const whatsappUrl = `https://wa.me/?text=${shareMessage}`

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-20 right-0 w-72 glass-card rounded-2xl p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-white">Share with Friends</h4>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mb-4 text-sm text-white/60">
                Send movie times to your WhatsApp group chat!
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-white transition-all hover:bg-[#25D366]/90"
              >
                <Send className="h-5 w-5" />
                Share on WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="lg"
          className={`h-16 w-16 rounded-full shadow-lg transition-all ${
            isExpanded 
              ? 'bg-white/20 text-white' 
              : 'bg-[#25D366] text-white hover:bg-[#25D366]/90'
          }`}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-7 w-7" />
          )}
        </Button>
      </motion.div>
    </>
  )
}
