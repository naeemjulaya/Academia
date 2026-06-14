// This page is never rendered — the middleware intercepts /dashboard
// and redirects the user to their role-specific portal before React runs.
// This file exists only as a Next.js route placeholder.
export default function DashboardIndex() {
  return null
}
