import { useParams } from "react-router-dom"
import { BigArticle } from "../components/BigArticle"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
export const ArticlePage = () => {
    const { id } = useParams()
    const articles = useSelector((state) => state.articles.articles)
    const article = articles.find(article => article.id === parseInt(id))
    const navigate = useNavigate()
    if (!article) {
        navigate("/404")
        return null
    }
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