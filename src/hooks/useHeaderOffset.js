import { useAnnouncements } from './queries/useAnnouncements'

/**
 * Returns the CSS class for page top padding based on whether announcements exist
 * Use this in page components: <main className={`... ${headerPaddingClass}`}>
 */
export function useHeaderOffset() {
  const { data: announcements = [] } = useAnnouncements()
  const hasAnnouncements = announcements.length > 0

  // With announcements: pt-40 sm:pt-44 (header at top-10/11 + header height)
  // Without announcements: pt-28 sm:pt-32 (header at top-0 + header height)
  const headerPaddingClass = hasAnnouncements
    ? 'pt-40 sm:pt-44'
    : 'pt-28 sm:pt-32'

  return { hasAnnouncements, headerPaddingClass }
}
