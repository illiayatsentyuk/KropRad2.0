const API_ORIGIN = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const toAbsolute = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    if (src.startsWith('/')) return `${API_ORIGIN}${src}`
    return `${API_ORIGIN}/${src}`
}

export const ArticleRenderer = ({ blocks }) => {
    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        return null
    }

    return (
        <div className="prose prose-lg max-w-none">
            {blocks.map((block, index) => {
                if (!block || !block.type) return null
                switch (block.type) {
                    case 'heading':
                        return (
                            <h2 key={index} className="text-3xl font-bold text-[#0A1E63] my-6">
                                {block.content}
                            </h2>
                        )
                    case 'paragraph': {
                        const hasLinks = Array.isArray(block.links) && block.links?.length
                        const hasImages = Array.isArray(block.images) && block.images?.length
                        return (
                            <div key={index} className="mb-5">
                                {block.content && (
                                    <p className="text-[#1E1E1E] text-lg leading-relaxed whitespace-pre-wrap">
                                        {block.content}
                                    </p>
                                )}
                                {hasLinks ? (
                                    <ul className="list-disc pl-6 mt-2">
                                        {block.links.map((l, i) => (
                                            <li key={i}>
                                                <a href={l.href} target="_blank" rel="noreferrer" className="text-[#2B59C3] hover:underline">
                                                    {l.text || l.href}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                                {hasImages ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                        {block.images.map((img, i) => (
                                            <img key={i} src={toAbsolute(img.src)} alt="" className="rounded-lg shadow" />
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        )
                    }
                    case 'image':
                        return (
                            <div key={index} className="my-6">
                                <img src={toAbsolute(block.src)} alt="" className="rounded-xl shadow" />
                            </div>
                        )
                    case 'link':
                        return (
                            <p key={index} className="my-2">
                                <a href={block.href} target="_blank" rel="noreferrer" className="text-[#2B59C3] hover:underline">
                                    {block.text || block.href}
                                </a>
                            </p>
                        )
                    default:
                        return null
                }
            })}
        </div>
    )
}


