import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FBFF] to-[#E9ECF2] px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-xl ring-1 ring-[#E9ECF2] mx-auto mb-6">
          <span className="text-4xl">🚫</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-[#0A1E63]">404</h1>
        <p className="mt-3 text-2xl font-semibold text-[#0A1E63]">Page not found</p>
        <p className="mt-2 text-[#6C7A89]">The page you’re looking for doesn’t exist or was moved.</p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-[#2B59C3] to-[#3F7EF7] hover:opacity-95 transition"
          >
            Go to Home
          </Link>
          <Link
            to="/articles"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-[#0A1E63] bg-white shadow hover:shadow-md ring-1 ring-[#E9ECF2] transition"
          >
            Browse Articles
          </Link>
        </div>

        <div className="mt-8 text-sm text-[#6C7A89]">
          If you think this is a mistake, please check the URL or return home.
        </div>
      </div>
    </div>
  )
}