import { Article } from "../components/Article"
import { fetchArticles, deleteArticle } from "../api/article"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { setArticles, deleteArticle as deleteArticleAction } from "../store/store"
export const ArticlesPage = () => {
    const dispatch = useDispatch()
    const articles = useSelector((state) => state.articles.articles)
    const accessToken = localStorage.getItem("access_token")
    const navigate = useNavigate()
    useEffect(() => {
        fetchArticles().then(data => {
            console.log(data)
            dispatch(setArticles(data))
        }).catch(error => {
            console.log(error)
        })
    }, [])

    const handleEditArticle = (id) =>{
        navigate(`/edit-article/${id}`)
    }

    const handleDelete = (id) => {
        deleteArticle(id, accessToken).then(data => {
            if (data.message === 'deleted') {
                dispatch(deleteArticleAction(id))
            } else {
                console.log(data)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    return (
        <div className="flex flex-col gap-4 w-full items-center justify-center h-screen bg-[#F4F6FA] text-[#2C2C2C] h-full ml-[300px]">
            {articles.map(article => (
                <Article key={article.id} id={article.id} title={article.title} description={article.description} author={article.user.name} handleDelete={handleDelete} handleEditArticle={handleEditArticle} />
            ))}
        </div>
    )
}