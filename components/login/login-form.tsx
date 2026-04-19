'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Film, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type LoginFormProps = {
  nextPath: string
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (
        error.message.toLowerCase().includes('invalid') ||
        error.message.toLowerCase().includes('credentials')
      ) {
        toast.error('Invalid email or password.')
      } else {
        toast.error(error.message)
      }
      setIsSubmitting(false)
      return
    }

    toast.success('Welcome back.')
    router.push(nextPath.startsWith('/') ? nextPath : '/admin')
    router.refresh()
    setIsSubmitting(false)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.25)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(247,181,0,0.12)_0%,_transparent_50%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.85))]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E50914]/40 bg-[#E50914]/10 shadow-[0_0_40px_rgba(229,9,20,0.35)]">
            <Film className="h-7 w-7 text-[#F7B500]" />
          </div>
          <h1 className="text-balance text-3xl font-black tracking-tight text-white md:text-4xl">
            Movie Palace <span className="text-[#E50914]">Grenada</span>
          </h1>
          <p className="mt-2 text-sm text-white/60">Manager portal — sign in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#0f0f0f]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-md md:p-8"
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F7B500]/70" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="manager@moviepalace.gd"
                  className="h-12 border-white/15 bg-black/40 pl-10 text-white placeholder:text-white/35 focus-visible:ring-[#E50914]/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F7B500]/70" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="h-12 border-white/15 bg-black/40 pl-10 text-white placeholder:text-white/35 focus-visible:ring-[#E50914]/50"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 h-12 w-full bg-[#E50914] text-base font-semibold text-white shadow-[0_0_24px_rgba(229,9,20,0.35)] hover:bg-[#E50914]/90"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>

          <p className="mt-6 text-center text-sm text-white/45">
            <Link
              href="/"
              className="font-medium text-[#F7B500] underline-offset-4 hover:underline"
            >
              ← Back to the public site
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
