const API_ORIGIN = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const rewriteUploads = (html) => {
    if (!html) return ''
    try {
        return html.replace(/src=\"\/(uploads\/[^\"]+)\"/g, (m, p1) => `src=\"${API_ORIGIN}/${p1}\"`)
    } catch {
        return html
    }
}

export const ArticleRenderer = ({ html }) => {
    if (!html) return null
    const safeHtml = rewriteUploads(html)
    return (
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: safeHtml }} />
    )
}
