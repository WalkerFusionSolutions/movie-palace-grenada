'use client'

import { motion } from 'framer-motion'
import { getScheduleDates } from '@/lib/movies'

interface DatePickerProps {
  selectedDate: string
  onSelectDate: (date: string) => void
}

export function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const dates = getScheduleDates()

  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2">
      <div className="flex gap-3 px-4 md:justify-center md:px-0">
        {dates.map((date, idx) => {
          const isSelected = selectedDate === date.date
          
          return (
            <motion.button
              key={date.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectDate(date.date)}
              className={`relative flex min-w-[72px] flex-col items-center rounded-2xl px-4 py-3 transition-all ${
                isSelected
                  ? 'bg-[#E50914] text-white'
                  : 'glass-card text-white/80 hover:bg-white/10'
              }`}
            >
              {date.isToday && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-[#F7B500] px-2 py-0.5 text-[10px] font-bold text-black">
                  TODAY
                </span>
              )}
              <span className="text-xs font-medium uppercase opacity-70">
                {date.dayName}
              </span>
              <span className="text-2xl font-bold">{date.dayNumber}</span>
              <span className="text-xs opacity-70">{date.month}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
