export function toYouTubeEmbedUrl(url: string | null): string {
  if (!url) return ''

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')
    const ytIdFromPath =
      host === 'youtu.be' ? parsed.pathname.split('/').filter(Boolean)[0] : null
    const ytIdFromQuery = parsed.searchParams.get('v')
    const ytId = ytIdFromPath ?? ytIdFromQuery

    if (host.includes('youtube.com') || host === 'youtu.be') {
      if (!ytId && parsed.pathname.includes('/embed/')) {
        const embedId = parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? ''
        if (!embedId) return ''
        return `https://www.youtube.com/embed/${embedId}?autoplay=1&rel=0`
      }
      if (!ytId) return ''
      return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`
    }

    parsed.searchParams.set('autoplay', '1')
    return parsed.toString()
  } catch {
    return ''
  }
}
