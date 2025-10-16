import { Article } from "../components/Article"
import { fetchArticles, deleteArticle } from "../api/article"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { setArticles, deleteArticle as deleteArticleAction } from "../store/store"
const getExcerptFromBlocks = (blocks) => {
    if (!Array.isArray(blocks)) return ""
    const strip = (html) => {
        if (!html) return ""
        const tmp = document.createElement('div')
        tmp.innerHTML = html
        const text = tmp.textContent || tmp.innerText || ""
        return text.trim()
    }
    const firstParagraph = blocks.find(b => b?.type === 'paragraph' && (b.html || b.content))
    const paraText = firstParagraph ? strip(firstParagraph.html || firstParagraph.content) : ""
    if (paraText) return paraText.slice(0, 180) + (paraText.length > 180 ? '…' : '')
    const firstHeading = blocks.find(b => b?.type === 'heading' && (b.html || b.content))
    const headText = firstHeading ? strip(firstHeading.html || firstHeading.content) : ""
    return headText
}

export const ArticlesPage = () => {
    const dispatch = useDispatch()
    const articles = useSelector((state) => state.articles.articles)
    const user = useSelector((state) => state.user.user)
    const isAdmin = user?.role === 'admin'
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
        <div className="flex flex-col gap-6 w-full items-center justify-start py-8 px-4 sm:py-10 sm:px-6">
            {(!articles || articles.length === 0) ? (
                <div className="w-full max-w-3xl text-center bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-[#E9ECF2]">
                    <div className="w-16 h-16 rounded-2xl bg-[#F5F8FF] ring-1 ring-[#E9ECF2] mx-auto flex items-center justify-center text-3xl mb-4">📄</div>
                    <h2 className="text-3xl font-bold text-[#0A1E63]">Поки що немає статей</h2>
                    <p className="mt-2 text-[#6C7A89]">Будьте першим, хто створить корисну статтю для спільноти.</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        {isAdmin ? (
                            <button
                                onClick={() => navigate('/create-article')}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-[#2B59C3] to-[#3F7EF7] hover:opacity-95 transition"
                            >
                                Створити статтю
                            </button>
                        ) : null}
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-[#0A1E63] bg-white shadow hover:shadow-md ring-1 ring-[#E9ECF2] transition"
                        >
                            На головну
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {articles.map(article => (
                        <Article
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            description={getExcerptFromBlocks(article.content)}
                            author={article.user?.name || ""}
                            handleDelete={handleDelete}
                            handleEditArticle={handleEditArticle}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}