import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
      <h1 className="text-xl font-semibold">
        <Link to="/" className="text-white hover:text-gray-300 transition-colors">
          🐰 Super Bunny Game
        </Link>
      </h1>
    </header>
  )
}
