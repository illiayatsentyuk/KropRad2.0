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
        <div className="flex flex-col gap-4 w-full items-center justify-center h-screen bg-[#F4F6FA] text-[#2C2C2C] h-full ml-[300px]">
            <div className="max-w-5xl mx-auto py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <BigArticle article={article} />
                </div>
            </div>
        </div>
    )
}