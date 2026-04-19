'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, CreditCard, Users, Baby } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getScheduleDates } from '@/lib/movies'
import type { Movie } from '@/lib/movies'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: string | null
  movies: Movie[]
  showtimesByMovie: Record<string, Record<string, string[]>>
}

type SeatStatus = 'available' | 'selected' | 'occupied'

const ROWS = 10
const COLS = 10
const SEAT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

const OCCUPIED_SEATS = new Set([
  'C3',
  'C4',
  'D5',
  'D6',
  'D7',
  'E4',
  'E5',
  'F8',
  'G3',
  'G4',
  'H6',
  'H7',
])

export function BookingModal({
  isOpen,
  onClose,
  movieId,
  movies,
  showtimesByMovie,
}: BookingModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set())
  const [adultTickets, setAdultTickets] = useState(0)
  const [childTickets, setChildTickets] = useState(0)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [step, setStep] = useState<'seats' | 'payment'>('seats')

  const movie = movies.find((m) => m.id === movieId)
  const dates = getScheduleDates()
  const byDate = movieId ? showtimesByMovie[movieId] : undefined
  const showtimes =
    movie && selectedDate ? byDate?.[selectedDate] ?? [] : []

  const adultPrice = 25
  const childPrice = 15
  const totalPrice = adultTickets * adultPrice + childTickets * childPrice

  useEffect(() => {
    if (isOpen && dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].date)
    }
  }, [isOpen, dates, selectedDate])

  useEffect(() => {
    if (showtimes.length > 0 && !showtimes.includes(selectedTime)) {
      setSelectedTime(showtimes[0])
    }
  }, [showtimes, selectedTime])

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeats(new Set())
      setAdultTickets(0)
      setChildTickets(0)
      setSelectedDate('')
      setSelectedTime('')
      setStep('seats')
    }
  }, [isOpen])

  const toggleSeat = (seatId: string) => {
    if (OCCUPIED_SEATS.has(seatId)) return

    setSelectedSeats((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(seatId)) {
        newSet.delete(seatId)
      } else {
        newSet.add(seatId)
      }
      return newSet
    })
  }

  const getSeatStatus = (seatId: string): SeatStatus => {
    if (OCCUPIED_SEATS.has(seatId)) return 'occupied'
    if (selectedSeats.has(seatId)) return 'selected'
    return 'available'
  }

  const getSeatStyles = (status: SeatStatus) => {
    switch (status) {
      case 'occupied':
        return 'bg-white/10 text-white/20 cursor-not-allowed'
      case 'selected':
        return 'bg-[#E50914] text-white cursor-pointer hover:bg-[#E50914]/80'
      default:
        return 'bg-white/20 text-white/60 cursor-pointer hover:bg-[#F7B500] hover:text-black'
    }
  }

  const handleProceedToPayment = () => {
    if (selectedSeats.size === 0 || adultTickets + childTickets === 0) return
    if (selectedSeats.size !== adultTickets + childTickets) {
      alert(`Please select exactly ${adultTickets + childTickets} seats`)
      return
    }
    setStep('payment')
  }

  if (!movie) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 pr-12">
              <h2 className="text-2xl font-bold text-white">
                {movie.title ?? 'Untitled'}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                <span>{movie.rating ?? 'NR'}</span>
              </div>
            </div>

            {step === 'seats' ? (
              <>
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">
                      Select Date
                    </label>
                    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-2">
                      {dates.map((date) => (
                        <button
                          key={date.date}
                          type="button"
                          onClick={() => setSelectedDate(date.date)}
                          className={`flex min-w-[60px] flex-col items-center rounded-lg border px-3 py-2 transition-all ${
                            selectedDate === date.date
                              ? 'border-[#E50914] bg-[#E50914]/20 text-white'
                              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-xs">{date.dayName}</span>
                          <span className="text-lg font-bold">
                            {date.dayNumber}
                          </span>
                          {date.isToday && (
                            <Badge className="mt-1 bg-[#F7B500] px-1.5 py-0 text-[10px] text-black">
                              TODAY
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">
                      Select Time
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {showtimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                            selectedTime === time
                              ? 'border-[#E50914] bg-[#E50914]/20 text-white'
                              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-[#F7B500]" />
                      <div>
                        <p className="font-medium text-white">Adult</p>
                        <p className="text-sm text-white/60">${adultPrice} EC</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setAdultTickets(Math.max(0, adultTickets - 1))
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="Decrease adult tickets"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-lg font-bold text-white">
                        {adultTickets}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdultTickets(adultTickets + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="Increase adult tickets"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <Baby className="h-5 w-5 text-[#F7B500]" />
                      <div>
                        <p className="font-medium text-white">Child</p>
                        <p className="text-sm text-white/60">${childPrice} EC</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setChildTickets(Math.max(0, childTickets - 1))
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="Decrease child tickets"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-lg font-bold text-white">
                        {childTickets}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildTickets(childTickets + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="Increase child tickets"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-4 block text-sm font-medium text-white/60">
                    Select Seats ({selectedSeats.size} of{' '}
                    {adultTickets + childTickets} selected)
                  </label>

                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-2 h-2 w-3/4 rounded-full bg-gradient-to-r from-transparent via-[#F7B500]/60 to-transparent" />
                    <p className="text-xs uppercase tracking-widest text-white/40">
                      Screen
                    </p>
                  </div>

                  <div className="overflow-x-auto pb-4">
                    <div className="mx-auto inline-block">
                      {Array.from({ length: ROWS }, (_, rowIndex) => (
                        <div key={rowIndex} className="mb-1 flex items-center gap-1">
                          <span className="w-6 text-center text-xs text-white/40">
                            {SEAT_LETTERS[rowIndex]}
                          </span>
                          <div className="flex gap-1">
                            {Array.from({ length: COLS }, (_, colIndex) => {
                              const seatId = `${SEAT_LETTERS[rowIndex]}${colIndex + 1}`
                              const status = getSeatStatus(seatId)

                              return (
                                <button
                                  key={seatId}
                                  type="button"
                                  onClick={() => toggleSeat(seatId)}
                                  disabled={status === 'occupied'}
                                  className={`flex h-7 w-7 items-center justify-center rounded text-xs font-medium transition-all ${getSeatStyles(status)}`}
                                  title={seatId}
                                >
                                  {colIndex + 1}
                                </button>
                              )
                            })}
                          </div>
                          <span className="w-6 text-center text-xs text-white/40">
                            {SEAT_LETTERS[rowIndex]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded bg-white/20" />
                      <span className="text-white/60">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded bg-[#E50914]" />
                      <span className="text-white/60">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded bg-white/10" />
                      <span className="text-white/60">Occupied</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-white/60">Total</p>
                    <p className="text-3xl font-bold text-white">
                      ${totalPrice}{' '}
                      <span className="text-lg font-normal text-white/60">EC</span>
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="glow-red bg-[#E50914] px-8 text-white hover:bg-[#E50914]/90 disabled:opacity-50"
                    disabled={
                      selectedSeats.size === 0 ||
                      adultTickets + childTickets === 0 ||
                      selectedSeats.size !== adultTickets + childTickets
                    }
                    onClick={handleProceedToPayment}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Payment
                  </Button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="mb-6 rounded-xl border border-[#F7B500]/30 bg-[#F7B500]/10 p-4">
                  <h3 className="mb-3 font-semibold text-[#F7B500]">
                    Booking Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/80">
                      <span>Date</span>
                      <span className="font-medium text-white">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Time</span>
                      <span className="font-medium text-white">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Seats</span>
                      <span className="font-medium text-white">
                        {Array.from(selectedSeats).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Adult x {adultTickets}</span>
                      <span className="font-medium text-white">
                        ${adultTickets * adultPrice} EC
                      </span>
                    </div>
                    {childTickets > 0 && (
                      <div className="flex justify-between text-white/80">
                        <span>Child x {childTickets}</span>
                        <span className="font-medium text-white">
                          ${childTickets * childPrice} EC
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold text-white">
                      <span>Total</span>
                      <span>${totalPrice} EC</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 text-center">
                  <p className="text-white/60">Payment integration coming soon!</p>
                  <p className="text-sm text-white/40">
                    For now, please pay at the cinema counter.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    onClick={() => setStep('seats')}
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="glow-golden flex-1 bg-[#F7B500] text-black hover:bg-[#F7B500]/90"
                    onClick={onClose}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
