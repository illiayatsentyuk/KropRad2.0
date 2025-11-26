import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { fetchArticleById } from "../api/article"
import { BigArticle } from "../components/BigArticle"

export const ArticlePage = () => {
    const { id } = useParams()
    const [article, setArticle] = useState(null)
    
    // Get articles from store
    const articlesFromStore = useSelector((state) => state.articles.articles)
    
    useEffect(() => {
        const articleId = parseInt(id)
        
        // Check if article exists in store first
        const cachedArticle = articlesFromStore.find(a => a.id === articleId)
        
        if (cachedArticle) {
            console.log('📦 Using article from store')
            setArticle(cachedArticle)
        } else {
            console.log('🌐 Fetching article from API')
            fetchArticleById(articleId).then(data => {
                setArticle(data)
            })
        }
    }, [id, articlesFromStore])

    return (
        <div className="flex flex-col gap-4 w-full items-start justify-start py-8 px-4 sm:py-10 sm:px-6">
            <div className="max-w-5xl w-full mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <BigArticle article={article} />
                </div>
            </div>
        </div>
    )
}