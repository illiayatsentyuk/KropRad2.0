import { ArticleRenderer } from "./ArticleRenderer"
import { useEffect, useMemo, useState } from "react"
import { submitArticleRating, fetchArticleAverageRating, fetchArticleRatingDistribution } from "../api/article"
import { useSelector } from "react-redux"

export const BigArticle = ({ article }) => {
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const [hovered, setHovered] = useState(0)
    const [selectedRating, setSelectedRating] = useState(0)
    const [average, setAverage] = useState(null)
    const [avgError, setAvgError] = useState("")
    const [distribution, setDistribution] = useState(null)
    const [distError, setDistError] = useState("")
    const user = useSelector((state) => state.user.user)
    const isAdmin = user?.role === 'admin'

    const fingerprint = useMemo(() => {
        const key = "fpid"
        const existing = localStorage.getItem(key)
        if (existing) return existing
        const fp = `${Math.random().toString(36).slice(2)}-${Date.now()}`
        localStorage.setItem(key, fp)
        return fp
    }, [])

    const handleRate = async (stars) => {
        if (!article || submitting || submitted) return
        setSubmitting(true)
        setError("")
        try {
            await submitArticleRating(article.id, stars, fingerprint)
            setSubmitted(true)
            setSelectedRating(stars)
            try {
                const key = `article_${article.id}_rating`
                localStorage.setItem(key, String(stars))
            } catch {}
        } catch (e) {
            setError(e.message || "Помилка відправки оцінки")
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        if (!article || !isAdmin) return
        const accessToken = localStorage.getItem("access_token")
        if (!accessToken) return
        fetchArticleAverageRating(article.id, accessToken)
            .then(setAverage)
            .catch(e => setAvgError(e.message || "Не вдалося завантажити середню оцінку"))
        fetchArticleRatingDistribution(article.id, accessToken)
            .then(setDistribution)
            .catch(e => setDistError(e.message || "Не вдалося завантажити розподіл оцінок"))
    }, [article, isAdmin])

    useEffect(() => {
        if (!article) return
        try {
            const key = `article_${article.id}_rating`
            const saved = parseInt(localStorage.getItem(key) || '0', 10)
            if (Number.isFinite(saved) && saved >= 1 && saved <= 5) {
                setSelectedRating(saved)
                setSubmitted(true)
            }
        } catch {}
    }, [article?.id])
    if (!article) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-[#6C7A89] text-lg">Loading article...</p>
            </div>
        )
    }

    return (
        <article className="max-w-4xl mx-auto px-6 py-12">
            {/* Article Header */}
            <header className="mb-8 pb-8 border-b-2 border-[#E9ECF2]">
                <h1 className="text-5xl font-bold text-[#0A1E63] mb-6 leading-tight">
                    {article.title}
                </h1>
                
                {/* Author Info */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2B59C3] to-[#3F7EF7] flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {article.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-[#0A1E63] font-semibold text-lg">
                            {article.user.name}
                        </p>
                        <p className="text-[#6C7A89] text-sm">
                            {article.user.email}
                        </p>
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <ArticleRenderer blocks={article.content} />

            {/* Rating Section */}
            <div className="mt-10 p-6 rounded-xl border border-[#E9ECF2] bg-[#F9FBFF]">
                <p className="text-[#0A1E63] font-semibold mb-3">Наскільки ця стаття була корисна?</p>
                <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((s) => (
                        <button
                            key={s}
                            disabled={submitting || submitted}
                            onMouseEnter={() => setHovered(s)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => handleRate(s)}
                            aria-label={`Rate ${s} star${s>1? 's': ''}`}
                            className={`text-3xl ${submitted ? 'cursor-default' : 'hover:scale-110'} transition-transform`}
                            style={{
                                color: (hovered >= s || selectedRating >= s) ? '#F5C518' : '#E0E6F0',
                                textShadow: (hovered >= s || selectedRating >= s) ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                            }}
                        >
                            {"★"}
                        </button>
                    ))}
                </div>
                {submitted && (
                    <p className="text-green-700 mt-2">Дякуємо за вашу оцінку!</p>
                )}
                {!!error && (
                    <p className="text-red-600 mt-2">{error}</p>
                )}
                {isAdmin && (
                    <div className="mt-4 text-sm text-[#0A1E63]">
                        {average ? (
                            <span>Середня оцінка: <strong>{average.average}</strong> (з {average.count})</span>
                        ) : avgError ? (
                            <span className="text-red-600">{avgError}</span>
                        ) : null}
                        {distribution ? (
                            <div className="mt-4 flex flex-col gap-2">
                                {[5,4,3,2,1].map((s) => {
                                    const total = distribution.total || 0
                                    const count = distribution.distribution?.[s] || 0
                                    const pct = total > 0 ? (count / total) * 100 : 0
                                    return (
                                        <div key={s} className="flex items-center gap-3">
                                            <div className="w-20 text-right text-[#6C7A89]">
                                                {Array.from({ length: s }).map((_, i) => (
                                                    <span key={i} className="text-[#C0C9D6]">★</span>
                                                ))}
                                            </div>
                                            <div className="flex-1 h-2 bg-[#EDF2FA] rounded">
                                                <div className="h-2 bg-[#0A1E63] rounded" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : distError ? (
                            <div className="mt-2 text-red-600">{distError}</div>
                        ) : null}
                    </div>
                )}
            </div>
        </article>
    )
}