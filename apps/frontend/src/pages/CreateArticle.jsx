import { CreateArticleForm } from "../components/CreateArticleForm"
import { fetchArticleById } from "../api/article"
import { useParams, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
export const CreateArticle = () => {
    const location = useLocation()
    const isEdit = location.pathname.includes("edit-article")
    const { id } = useParams()
    const [article, setArticle] = useState(null)
    useEffect(() => {
        if (isEdit) {
            fetchArticleById(id).then(data => {
                setArticle(data)
            })
        }
    }, [id, isEdit])
    return (
        <div className="flex w-full items-center justify-center py-10 px-6">
            <CreateArticleForm article={article} isEdit={isEdit} />
        </div>
    )
}