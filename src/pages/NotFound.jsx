import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
      <p className="text-text mb-8">Page not found</p>
      <Link to="/" className="text-primary hover:underline">
        Go Home
      </Link>
    </div>
  )
}
