const API_ORIGIN = import.meta.env.VITE_API_URL ?? 'https://krop-rad2-0-backend.vercel.app/'
const toAbsolute = (src) => {
    if (!src) return ''
    // If it's a data URI (base64), return as-is
    if (src.startsWith('data:')) return src
    // If it's already absolute URL, return as-is
    if (/^https?:\/\//i.test(src)) return src
    // Convert relative paths to absolute
    if (src.startsWith('/')) return `${API_ORIGIN}${src}`
    return `${API_ORIGIN}/${src}`
}

const rewriteUploads = (html) => {
    if (!html) return ''
    try {
        // No need to rewrite data URIs, they're already embedded
        // Only rewrite old /uploads/ paths if any exist (for backward compatibility)
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
                                className="text-3xl font-bold text-[#1E1E1E] my-6"
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
                        if (block.images.length >= 2) {
                            return (
                                <div key={index} className="my-6 grid grid-cols-2 md:grid-cols-3 gap-4 ">
                                    {block.images.map((image, i) => (
                                        <img src={toAbsolute(image.src)} alt="" className="rounded-xl shadow" />
                                    ))}
                                </div>
                            );
                        }else if(block.images.length === 1) {
                            return (
                                <div key={index} className="my-6">
                                    <img src={toAbsolute(block.images[0].src)} alt="" className="rounded-xl shadow" />
                                </div>
                            );
                        }else {
                            return null;
                        }
                        
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


