'use client'

import { motion } from 'framer-motion'
import { Ticket, Sparkles, Users, Baby } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function PricingSection() {
  return (
    <section className="px-4 py-16 md:px-8 lg:px-16" id="pricing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          Ticket <span className="text-[#F7B500]">Pricing</span>
        </h2>
        <p className="text-white/60">Affordable entertainment for the whole family</p>
      </motion.div>

      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Super Saver Tuesday - Featured */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="relative overflow-hidden border-[#F7B500]/30 bg-gradient-to-br from-[#F7B500]/20 to-[#F7B500]/5 glow-golden">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#F7B500]/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-[#F7B500]/10 blur-2xl" />
              <CardContent className="relative p-6 md:p-8">
                <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7B500]">
                      <Sparkles className="h-8 w-8 text-black" />
                    </div>
                    <div>
                      <Badge className="mb-2 bg-[#F7B500] text-black hover:bg-[#F7B500]">
                        BEST VALUE
                      </Badge>
                      <h3 className="text-2xl font-bold text-white">Super Saver Tuesdays</h3>
                      <p className="text-white/70">All tickets, all movies, one price</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="flex items-baseline justify-center gap-1 md:justify-end">
                      <span className="text-5xl font-black text-[#F7B500]">$15</span>
                      <span className="text-xl text-white/60">EC</span>
                    </div>
                    <p className="text-sm text-white/50">Every Tuesday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Standard Adult */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card border-white/10 h-full">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E50914]/20">
                  <Users className="h-7 w-7 text-[#E50914]" />
                </div>
                <h3 className="mb-1 text-xl font-bold text-white">Adults</h3>
                <p className="mb-4 text-sm text-white/60">Standard admission</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$25</span>
                  <span className="text-lg text-white/60">EC</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Kids */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card border-white/10 h-full">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/20">
                  <Baby className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="mb-1 text-xl font-bold text-white">Kids</h3>
                <p className="mb-4 text-sm text-white/60">Under 12 years</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$15</span>
                  <span className="text-lg text-white/60">EC</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 2 for 1 Wednesday */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Card className="relative overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/20 to-green-500/5">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/10 blur-2xl" />
            <CardContent className="relative p-5 md:p-6">
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                    <Ticket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Badge className="mb-1 bg-green-500 text-white hover:bg-green-500">
                      SPECIAL DEAL
                    </Badge>
                    <h3 className="text-xl font-bold text-white">2 for 1 Wednesdays</h3>
                    <p className="text-white/70">Buy one adult ticket, get one free!</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="flex items-baseline justify-center gap-1 md:justify-end">
                    <span className="text-3xl font-black text-green-400">$25</span>
                    <span className="text-lg text-white/60">EC</span>
                  </div>
                  <p className="text-sm text-white/50">Every Wednesday</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* No Outside Food Warning */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm font-bold text-red-500"
        >
          No Outside Food Allowed!!!
        </motion.p>

        {/* Snacks Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55 }}
          className="mt-2 text-center text-sm text-white/40"
        >
          🍿 Popcorn, drinks & snacks available at our concession stand
        </motion.p>
      </div>
    </section>
  )
}
