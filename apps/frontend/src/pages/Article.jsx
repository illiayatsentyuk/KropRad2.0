import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchArticleById } from "../api/article"
import { BigArticle } from "../components/BigArticle"

export const ArticlePage = () => {
    const { id } = useParams()
    const [article, setArticle] = useState(null)
    useEffect(() => {
        fetchArticleById(id).then(data => {
            setArticle(data)
        })
    }, [id])

    return (
        <div className="flex flex-col gap-4 w-full items-start justify-start py-10 px-6">
            <div className="max-w-5xl w-full mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <BigArticle article={article} />
                </div>
            </div>
        </div>
    )
}