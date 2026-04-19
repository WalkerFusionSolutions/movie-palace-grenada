'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Film,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Checkbox } from '@/components/ui/checkbox'
import type { MovieRow } from '@/app/actions/admin'
import {
  addShowtime,
  deleteMovie,
  deleteShowtime,
  signOut,
  toggleMovieFlag,
  upsertMovie,
} from '@/app/actions/admin'

export type ShowtimeRow = {
  id: string
  movie_id: string
  start_time: string
  is_3d: boolean
}

function getRatingColor(rating: string | null) {
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

function formatShowtime(ts: string) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return ts
  }
}

type AdminDashboardProps = {
  initialMovies: MovieRow[]
  initialShowtimes: ShowtimeRow[]
}

export function AdminDashboard({
  initialMovies,
  initialShowtimes,
}: AdminDashboardProps) {
  const router = useRouter()
  const [movies, setMovies] = useState(initialMovies)
  const [showtimes, setShowtimes] = useState(initialShowtimes)

  useEffect(() => {
    setMovies(initialMovies)
  }, [initialMovies])

  useEffect(() => {
    setShowtimes(initialShowtimes)
  }, [initialShowtimes])

  const showtimesByMovie = useMemo(() => {
    const map: Record<string, ShowtimeRow[]> = {}
    for (const s of showtimes) {
      map[s.movie_id] ??= []
      map[s.movie_id].push(s)
    }
    for (const id of Object.keys(map)) {
      map[id].sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      )
    }
    return map
  }, [showtimes])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MovieRow | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    poster_url: '',
    trailer_url: '',
    rating: 'PG',
  })
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm({
      title: '',
      description: '',
      poster_url: '',
      trailer_url: '',
      rating: 'PG',
    })
    setDialogOpen(true)
  }

  function openEdit(movie: MovieRow) {
    setEditing(movie)
    setForm({
      title: movie.title ?? '',
      description: movie.description ?? '',
      poster_url: movie.poster_url ?? '',
      trailer_url: movie.trailer_url ?? '',
      rating: movie.rating ?? 'PG',
    })
    setDialogOpen(true)
  }

  async function handleSaveMovie() {
    if (!form.title.trim()) {
      toast.error('Title is required.')
      return
    }
    setSaving(true)
    const res = await upsertMovie({
      id: editing?.id,
      title: form.title.trim(),
      description: form.description,
      poster_url: form.poster_url,
      trailer_url: form.trailer_url,
      rating: form.rating,
    })
    setSaving(false)
    if ('error' in res && res.error) {
      toast.error(res.error)
      return
    }
    toast.success(editing ? 'Movie updated.' : 'Movie added.')
    setDialogOpen(false)
    router.refresh()
  }

  async function handleToggle(
    movieId: string,
    field: 'is_now_playing' | 'is_coming_soon',
    value: boolean
  ) {
    const res = await toggleMovieFlag(movieId, field, value)
    if ('error' in res && res.error) {
      toast.error(res.error)
      return
    }
    toast.success('Updated.')
    setMovies((prev) =>
      prev.map((m) =>
        m.id === movieId ? { ...m, [field]: value } : m
      )
    )
    router.refresh()
  }

  async function handleDeleteShowtime(id: string) {
    const res = await deleteShowtime(id)
    if ('error' in res && res.error) {
      toast.error(res.error)
      return
    }
    toast.success('Showtime removed.')
    setShowtimes((prev) => prev.filter((s) => s.id !== id))
    router.refresh()
  }

  async function handleAddShowtime(
    movieId: string,
    localDatetime: string,
    is3d: boolean
  ): Promise<boolean> {
    if (!localDatetime) {
      toast.error('Pick a date and time.')
      return false
    }
    const iso = new Date(localDatetime).toISOString()
    const res = await addShowtime({
      movie_id: movieId,
      start_time: iso,
      is_3d: is3d,
    })
    if ('error' in res && res.error) {
      toast.error(res.error)
      return false
    }
    toast.success('Showtime added.')
    router.refresh()
    return true
  }

  async function handleDeleteMovie(movieId: string) {
    const res = await deleteMovie(movieId)
    if ('error' in res && res.error) {
      toast.error(res.error)
      return
    }
    toast.success('Movie deleted.')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 pb-8 pt-4 md:px-6 lg:px-10">
      <header className="sticky top-0 z-10 -mx-4 mb-6 border-b border-white/10 bg-[#050505]/95 px-4 py-3 backdrop-blur-md md:-mx-6 md:px-6 lg:-mx-10 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Link
              href="/"
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:border-[#F7B500]/40 hover:bg-white/10"
              aria-label="Back to site"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F7B500]">
                Manager portal
              </p>
              <h1 className="text-xl font-black tracking-tight text-white md:text-2xl">
                Movie Palace <span className="text-[#E50914]">Grenada</span>
              </h1>
              <p className="text-sm text-white/55">
                Movies &amp; showtimes — live site updates on save
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              className="border-[#F7B500]/35 bg-[#F7B500]/10 text-[#F7B500] hover:bg-[#F7B500]/20 hover:text-[#F7B500]"
            >
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View live site
              </Link>
            </Button>
            <form action={signOut}>
              <Button
                type="submit"
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-white/70">
            <Film className="h-5 w-5 text-[#E50914]" />
            <span className="font-medium">All movies</span>
            <Badge className="border-[#F7B500]/35 bg-[#F7B500]/15 text-[#F7B500]">
              {movies.length}
            </Badge>
          </div>
          <Button
            onClick={openCreate}
            className="bg-[#E50914] font-semibold text-white shadow-[0_0_24px_rgba(229,9,20,0.35)] hover:bg-[#E50914]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add movie
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-xl shadow-black/40">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="min-w-[200px] text-white/80">
                  Movie
                </TableHead>
                <TableHead className="hidden text-white/80 md:table-cell">
                  Rating
                </TableHead>
                <TableHead className="text-center text-white/80">
                  Now playing
                </TableHead>
                <TableHead className="text-center text-white/80">
                  Coming soon
                </TableHead>
                <TableHead className="text-right text-white/80">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow
                  key={movie.id}
                  className="border-white/10 bg-transparent hover:bg-white/[0.03]"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-14 w-10 shrink-0 rounded-md bg-cover bg-center ring-1 ring-white/10"
                        style={{
                          backgroundImage: movie.poster_url
                            ? `url(${movie.poster_url})`
                            : undefined,
                          backgroundColor: '#1a1a1a',
                        }}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {movie.title ?? 'Untitled'}
                        </p>
                        <Collapsible className="mt-2 md:hidden">
                          <CollapsibleTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-xs text-[#F7B500] hover:bg-[#F7B500]/10 hover:text-[#F7B500]"
                            >
                              Showtimes ({showtimesByMovie[movie.id]?.length ?? 0})
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 space-y-2 rounded-xl border border-white/10 bg-black/30 p-3">
                            <ShowtimeBlock
                              movieId={movie.id}
                              items={showtimesByMovie[movie.id] ?? []}
                              onAdd={(local, is3d) =>
                                handleAddShowtime(movie.id, local, is3d)
                              }
                              onDelete={handleDeleteShowtime}
                            />
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={getRatingColor(movie.rating)}
                    >
                      {movie.rating ?? '—'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={movie.is_now_playing}
                        onCheckedChange={(v) =>
                          void handleToggle(movie.id, 'is_now_playing', v)
                        }
                        className="data-[state=checked]:bg-[#E50914]"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={movie.is_coming_soon}
                        onCheckedChange={(v) =>
                          void handleToggle(movie.id, 'is_coming_soon', v)
                        }
                        className="data-[state=checked]:bg-[#F7B500]"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => openEdit(movie)}
                        aria-label="Edit movie"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            aria-label="Delete movie"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-white/10 bg-[#141414] text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete movie?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                              This removes &quot;{movie.title}&quot; and its
                              showtimes from the database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-[#E50914] hover:bg-[#E50914]/90"
                              onClick={() => void handleDeleteMovie(movie.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {movies.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
              <Film className="h-10 w-10 text-white/20" />
              <p className="text-white/60">No movies yet.</p>
              <Button
                onClick={openCreate}
                className="bg-[#E50914] text-white hover:bg-[#E50914]/90"
              >
                Add your first movie
              </Button>
            </div>
          )}
        </div>

        {/* Desktop showtime sections */}
        <div className="hidden space-y-4 md:block">
          {movies.map((movie) => (
            <section
              key={`st-${movie.id}`}
              className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-4 shadow-lg shadow-black/30"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Calendar className="h-4 w-4 text-[#F7B500]" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  Showtimes —{' '}
                  <span className="text-white">{movie.title}</span>
                </h2>
              </div>
              <ShowtimeBlock
                movieId={movie.id}
                items={showtimesByMovie[movie.id] ?? []}
                onAdd={(local, is3d) =>
                  handleAddShowtime(movie.id, local, is3d)
                }
                onDelete={handleDeleteShowtime}
              />
            </section>
          ))}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-white/10 bg-[#141414] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editing ? 'Edit movie' : 'Add movie'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="border-white/15 bg-black/40 text-white"
                placeholder="Movie title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]/50"
                placeholder="Synopsis"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poster_url">Poster URL</Label>
              <Input
                id="poster_url"
                value={form.poster_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, poster_url: e.target.value }))
                }
                className="border-white/15 bg-black/40 text-white"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailer_url">Trailer URL</Label>
              <Input
                id="trailer_url"
                value={form.trailer_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, trailer_url: e.target.value }))
                }
                className="border-white/15 bg-black/40 text-white"
                placeholder="YouTube embed or watch URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <select
                id="rating"
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: e.target.value }))
                }
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]/50"
              >
                {['G', 'PG', 'PG-13', 'R', 'NC-17'].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#E50914] text-white hover:bg-[#E50914]/90"
              disabled={saving}
              onClick={() => void handleSaveMovie()}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ShowtimeBlock({
  movieId,
  items,
  onAdd,
  onDelete,
}: {
  movieId: string
  items: ShowtimeRow[]
  onAdd: (localDatetime: string, is3d: boolean) => Promise<boolean>
  onDelete: (id: string) => void
}) {
  const [local, setLocal] = useState('')
  const [is3d, setIs3d] = useState(false)
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-white/45">No showtimes yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((s) => (
            <li
              key={s.id}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2 text-sm text-white/85">
                <Clock className="h-4 w-4 shrink-0 text-[#F7B500]" />
                <span>{formatShowtime(s.start_time)}</span>
                {s.is_3d && (
                  <Badge className="border-[#E50914]/40 bg-[#E50914]/15 text-[#E50914]">
                    3D
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/15"
                onClick={() => void onDelete(s.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/30 p-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label className="text-white/70">Add showtime</Label>
          <Input
            type="datetime-local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="border-white/15 bg-black/40 text-white"
          />
        </div>
        <div className="flex items-center gap-2 pb-1">
          <Checkbox
            id={`3d-${movieId}`}
            checked={is3d}
            onCheckedChange={(checked) => setIs3d(Boolean(checked))}
          />
          <Label htmlFor={`3d-${movieId}`} className="text-sm text-white/80">
            3D
          </Label>
        </div>
        <Button
          type="button"
          disabled={adding}
          className="bg-[#F7B500] font-semibold text-black hover:bg-[#F7B500]/90"
          onClick={async () => {
            setAdding(true)
            const ok = await onAdd(local, is3d)
            setAdding(false)
            if (ok) {
              setLocal('')
              setIs3d(false)
            }
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  )
}
