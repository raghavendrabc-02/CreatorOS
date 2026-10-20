// Formats a number of minutes as a short relative time, e.g. "5m ago", "3h ago", "2d ago".
export function formatTimeAgo(minutes) {
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
