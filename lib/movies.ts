export interface Movie {
  id: string
  title: string
  poster: string
  rating: 'G' | 'PG' | 'PG-13' | 'R'
  duration: string
  genre: string
  description: string
  trailer: string
  showtimes: {
    [date: string]: string[]
  }
}

export interface ComingSoonMovie {
  id: string
  title: string
  poster: string
  releaseDate: string
  genre: string
  description: string
}

export const movies: Movie[] = [
  {
    id: '1',
    title: 'The Super Mario Galaxy Movie',
    poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    rating: 'PG',
    duration: '2h 05m',
    genre: 'Animation / Adventure',
    description: 'Mario and Luigi embark on an intergalactic adventure to save Princess Peach from Bowser\'s cosmic fortress.',
    trailer: 'https://www.youtube.com/embed/KydqdKKyGEk',
    showtimes: {
      '2026-04-18': ['4:30 PM', '7:00 PM', '9:30 PM'],
      '2026-04-19': ['2:00 PM', '4:30 PM', '7:00 PM', '9:30 PM'],
      '2026-04-20': ['2:00 PM', '5:00 PM', '8:00 PM'],
      '2026-04-22': ['4:30 PM', '7:00 PM'],
      '2026-04-23': ['4:30 PM', '7:00 PM', '9:30 PM'],
    }
  },
  {
    id: '2',
    title: 'Hoppers',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    rating: 'PG',
    duration: '1h 45m',
    genre: 'Comedy / Family',
    description: 'A group of unlikely animal friends hop across continents on an epic journey of friendship and discovery.',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    showtimes: {
      '2026-04-18': ['5:00 PM', '7:30 PM'],
      '2026-04-19': ['3:00 PM', '5:30 PM', '8:00 PM'],
      '2026-04-20': ['3:00 PM', '5:30 PM', '8:00 PM'],
      '2026-04-22': ['5:00 PM', '7:30 PM'],
      '2026-04-23': ['5:00 PM', '7:30 PM', '10:00 PM'],
    }
  },
  {
    id: '3',
    title: 'You, Me and Tuscany',
    poster: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
    rating: 'PG-13',
    duration: '2h 00m',
    genre: 'Romance / Drama',
    description: 'Two strangers find unexpected love under the Tuscan sun in this heartwarming romantic journey.',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    showtimes: {
      '2026-04-18': ['6:00 PM', '9:00 PM'],
      '2026-04-19': ['6:00 PM', '9:00 PM'],
      '2026-04-20': ['6:00 PM', '9:00 PM'],
      '2026-04-22': ['6:00 PM', '9:00 PM'],
      '2026-04-23': ['6:00 PM', '9:00 PM'],
    }
  },
  {
    id: '4',
    title: 'They Will Kill You',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80',
    rating: 'R',
    duration: '2h 15m',
    genre: 'Horror / Thriller',
    description: 'A group of friends must survive the night when their remote cabin getaway turns into a nightmare.',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    showtimes: {
      '2026-04-18': ['8:00 PM', '10:30 PM'],
      '2026-04-19': ['8:00 PM', '10:30 PM'],
      '2026-04-20': ['8:00 PM', '10:30 PM'],
      '2026-04-22': ['8:00 PM', '10:30 PM'],
      '2026-04-23': ['8:00 PM', '10:30 PM'],
    }
  },
  {
    id: '5',
    title: 'Project Hail Mary',
    poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    rating: 'PG-13',
    duration: '2h 30m',
    genre: 'Sci-Fi / Adventure',
    description: 'An astronaut wakes up alone on a spaceship with no memory, humanity\'s survival resting on his shoulders.',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    showtimes: {
      '2026-04-18': ['4:00 PM', '7:00 PM', '10:00 PM'],
      '2026-04-19': ['1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'],
      '2026-04-20': ['1:00 PM', '4:00 PM', '7:00 PM'],
      '2026-04-22': ['4:00 PM', '7:00 PM'],
      '2026-04-23': ['4:00 PM', '7:00 PM', '10:00 PM'],
    }
  },
  {
    id: '6',
    title: 'Reminders of Him',
    poster: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&q=80',
    rating: 'PG-13',
    duration: '1h 55m',
    genre: 'Drama / Romance',
    description: 'A woman fights to reconnect with her daughter after being released from prison for a tragic mistake.',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    showtimes: {
      '2026-04-18': ['5:30 PM', '8:00 PM'],
      '2026-04-19': ['3:00 PM', '5:30 PM', '8:00 PM'],
      '2026-04-20': ['3:00 PM', '5:30 PM', '8:00 PM'],
      '2026-04-22': ['5:30 PM', '8:00 PM'],
      '2026-04-23': ['5:30 PM', '8:00 PM'],
    }
  },
  {
    id: '7',
    title: 'Scream 7',
    poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80',
    rating: 'R',
    duration: '2h 10m',
    genre: 'Horror / Slasher',
    description: 'Ghostface returns with a vengeance in this terrifying new chapter of the iconic slasher franchise.',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    showtimes: {
      '2026-04-18': ['9:00 PM', '11:30 PM'],
      '2026-04-19': ['9:00 PM', '11:30 PM'],
      '2026-04-20': ['9:00 PM'],
      '2026-04-22': ['9:00 PM'],
      '2026-04-23': ['9:00 PM', '11:30 PM'],
    }
  },
  {
    id: '8',
    title: 'Lee Cronin\'s The Mummy',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    rating: 'R',
    duration: '2h 20m',
    genre: 'Horror / Action',
    description: 'A terrifying reimagining of the classic monster from the visionary director of Evil Dead Rise.',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    showtimes: {
      '2026-04-18': ['7:30 PM', '10:00 PM'],
      '2026-04-19': ['5:00 PM', '7:30 PM', '10:00 PM'],
      '2026-04-20': ['5:00 PM', '7:30 PM', '10:00 PM'],
      '2026-04-22': ['7:30 PM', '10:00 PM'],
      '2026-04-23': ['7:30 PM', '10:00 PM'],
    }
  },
  {
    id: '9',
    title: 'Beast',
    poster: 'https://images.unsplash.com/photo-1614729939124-032d1e6c9945?w=800&q=80',
    rating: 'R',
    duration: '1h 53m',
    genre: 'Thriller / Survival',
    description: 'A father must protect his daughters from a deadly rogue lion in the African savanna.',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    showtimes: {
      '2026-04-18': ['6:30 PM', '9:00 PM'],
      '2026-04-19': ['4:00 PM', '6:30 PM', '9:00 PM'],
      '2026-04-20': ['4:00 PM', '6:30 PM', '9:00 PM'],
      '2026-04-22': ['6:30 PM', '9:00 PM'],
      '2026-04-23': ['6:30 PM', '9:00 PM'],
    }
  }
]

export const comingSoonMovies: ComingSoonMovie[] = [
  {
    id: 'cs1',
    title: 'Sheep Detective',
    poster: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=800&q=80',
    releaseDate: 'May 7',
    genre: 'Animation / Comedy',
    description: 'A woolly hero cracks cases in this family-friendly detective adventure.'
  },
  {
    id: 'cs2',
    title: 'Masters of the Universe',
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=800&q=80',
    releaseDate: 'Jun 4',
    genre: 'Action / Fantasy',
    description: 'He-Man returns in an epic live-action battle against Skeletor.'
  },
  {
    id: 'cs3',
    title: 'Mortal Kombat 2',
    poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
    releaseDate: 'May 7',
    genre: 'Action / Martial Arts',
    description: 'The ultimate fighting tournament continues with new warriors joining the fray.'
  },
  {
    id: 'cs4',
    title: 'Michael',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    releaseDate: 'Coming Soon',
    genre: 'Biography / Drama',
    description: 'The untold story of the King of Pop, Michael Jackson.'
  },
  {
    id: 'cs5',
    title: 'The Devil Wears Prada 2',
    poster: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    releaseDate: 'Coming Soon',
    genre: 'Comedy / Drama',
    description: 'Miranda Priestly returns with a vengeance in the fashion world sequel.'
  },
  {
    id: 'cs6',
    title: 'Iron Lung',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    releaseDate: 'Coming Soon',
    genre: 'Sci-Fi / Horror',
    description: 'A convict pilots a submarine through an ocean of blood on a dead moon.'
  },
  {
    id: 'cs7',
    title: 'In The Grey',
    poster: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    releaseDate: 'Coming Soon',
    genre: 'Drama / Thriller',
    description: 'A gripping tale of survival and moral ambiguity in extreme conditions.'
  }
]

// Static schedule dates to avoid hydration mismatch
export const scheduleDates = [
  { date: '2026-04-18', dayName: 'Fri', dayNumber: 18, month: 'Apr', isToday: true },
  { date: '2026-04-19', dayName: 'Sat', dayNumber: 19, month: 'Apr', isToday: false },
  { date: '2026-04-20', dayName: 'Sun', dayNumber: 20, month: 'Apr', isToday: false },
  { date: '2026-04-22', dayName: 'Tue', dayNumber: 22, month: 'Apr', isToday: false },
  { date: '2026-04-23', dayName: 'Wed', dayNumber: 23, month: 'Apr', isToday: false },
  { date: '2026-04-24', dayName: 'Thu', dayNumber: 24, month: 'Apr', isToday: false },
]

export const getScheduleDates = () => scheduleDates
