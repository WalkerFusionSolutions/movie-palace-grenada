'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type MovieRow = {
  id: string
  title: string | null
  description: string | null
  poster_url: string | null
  trailer_url: string | null
  is_now_playing: boolean
  is_coming_soon: boolean
  rating: string | null
}

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return null
  return { supabase, user }
}

function revalidatePublic() {
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function toggleMovieFlag(
  movieId: string,
  field: 'is_now_playing' | 'is_coming_soon',
  value: boolean
) {
  const auth = await requireUser()
  if (!auth) {
    return { error: 'Unauthorized' }
  }
  const { supabase } = auth

  const { error } = await supabase
    .from('movies')
    .update({ [field]: value })
    .eq('id', movieId)

  if (error) {
    return { error: error.message }
  }
  revalidatePublic()
  return { success: true }
}

export async function upsertMovie(input: {
  id?: string
  title: string
  description: string
  poster_url: string
  trailer_url: string
  rating: string
}) {
  const auth = await requireUser()
  if (!auth) {
    return { error: 'Unauthorized' }
  }
  const { supabase } = auth

  const payload = {
    title: input.title,
    description: input.description || null,
    poster_url: input.poster_url || null,
    trailer_url: input.trailer_url || null,
    rating: input.rating || null,
  }

  if (input.id) {
    const { error } = await supabase.from('movies').update(payload).eq('id', input.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('movies').insert({
      ...payload,
      is_now_playing: false,
      is_coming_soon: false,
    })
    if (error) return { error: error.message }
  }

  revalidatePublic()
  return { success: true }
}

export async function deleteMovie(movieId: string) {
  const auth = await requireUser()
  if (!auth) {
    return { error: 'Unauthorized' }
  }
  const { supabase } = auth

  const { error } = await supabase.from('movies').delete().eq('id', movieId)
  if (error) {
    return { error: error.message }
  }
  revalidatePublic()
  return { success: true }
}

export async function addShowtime(input: {
  movie_id: string
  start_time: string
  is_3d: boolean
}) {
  const auth = await requireUser()
  if (!auth) {
    return { error: 'Unauthorized' }
  }
  const { supabase } = auth

  const { error } = await supabase.from('showtimes').insert({
    movie_id: input.movie_id,
    start_time: input.start_time,
    is_3d: input.is_3d,
  })

  if (error) {
    return { error: error.message }
  }
  revalidatePublic()
  return { success: true }
}

export async function deleteShowtime(showtimeId: string) {
  const auth = await requireUser()
  if (!auth) {
    return { error: 'Unauthorized' }
  }
  const { supabase } = auth

  const { error } = await supabase.from('showtimes').delete().eq('id', showtimeId)
  if (error) {
    return { error: error.message }
  }
  revalidatePublic()
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/login')
}
