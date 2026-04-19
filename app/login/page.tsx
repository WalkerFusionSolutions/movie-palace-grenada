import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from '@/components/login/login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const sp = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/admin')
  }

  const nextPath =
    sp.next && sp.next.startsWith('/') && !sp.next.startsWith('//')
      ? sp.next
      : '/admin'

  return <LoginForm nextPath={nextPath} />
}
