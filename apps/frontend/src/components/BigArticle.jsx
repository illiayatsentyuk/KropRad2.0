import { ArticleRenderer } from "./ArticleRenderer"

export const BigArticle = ({ article }) => {
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
            <ArticleRenderer html={article.content} />
        </article>
    )
}