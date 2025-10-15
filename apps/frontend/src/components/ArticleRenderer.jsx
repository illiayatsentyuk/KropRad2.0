const API_ORIGIN = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const toAbsolute = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    if (src.startsWith('/')) return `${API_ORIGIN}${src}`
    return `${API_ORIGIN}/${src}`
}

const rewriteUploads = (html) => {
    if (!html) return ''
    try {
        return html
            .replace(/src=\"\/(uploads\/[^\"]+)\"/g, (_, p1) => `src=\"${API_ORIGIN}/${p1}\"`)
            .replace(/src='\/(uploads\/[^']+)'/g, (_, p1) => `src='${API_ORIGIN}/${p1}'`)
    } catch {
        return html
    }
}

export const ArticleRenderer = ({ blocks }) => {
    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        return null
    }

    return (
        <div className="prose prose-lg max-w-none flex flex-col gap-4">
            {blocks.map((block, index) => {
                if (!block || !block.type) return null
                switch (block.type) {
                    case 'heading':
                        return (
                            <h2
                                key={index}
                                className="text-3xl font-bold text-[#0A1E63] my-6"
                                dangerouslySetInnerHTML={{ __html: rewriteUploads(block.html || '') }}
                            />
                        )
                    case 'unordered-list': {
                        if (!Array.isArray(block.items) || block.items.length === 0) return null
                        return (
                            <ul key={index} className="list-disc pl-6 my-4">
                                {block.items.map((item, i) => (
                                    <li key={i} className="text-[#1E1E1E]" dangerouslySetInnerHTML={{ __html: rewriteUploads(item?.html || '') }} />
                                ))}
                            </ul>
                        )
                    }
                    case 'ordered-list': {
                        if (!Array.isArray(block.items) || block.items.length === 0) return null
                        return (
                            <ol key={index} className="list-decimal pl-6 my-4">
                                {block.items.map((item, i) => (
                                    <li key={i} className="text-[#1E1E1E]" dangerouslySetInnerHTML={{ __html: rewriteUploads(item?.html || '') }} />
                                ))}
                            </ol>
                        )
                    }
                    case 'paragraph': {
                        return (
                            <div key={index} className="mb-5">
                                {block.html ? (
                                    <div
                                        className="text-[#1E1E1E] text-lg leading-relaxed container-image"
                                        dangerouslySetInnerHTML={{ __html: rewriteUploads(block.html) }}
                                    />
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
                    case 'images':
                        return (
                            <div key={index} className="my-6 grid grid-cols-2 md:grid-cols-3 gap-4 ">
                                {block.images.map((image, i) => (
                                    <img src={toAbsolute(image.src)} alt="" className="rounded-xl shadow" />
                                ))}
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


