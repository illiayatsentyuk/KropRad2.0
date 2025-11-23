import { useRef, useState } from "react"
import { createArticle, updateArticle } from "../api/article"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addArticle, updateArticle as updateArticleAction } from "../store/store"

export const CreateArticleForm = ({ article, isEdit }) => {
    const formRef = useRef(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [fileName, setFileName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const form = formRef.current
        const formData = new FormData(form)

        if (isEdit) {
            const values = Object.fromEntries(formData.entries())
            updateArticle(article.id, values).then(data => {
                dispatch(updateArticleAction(data))
                navigate("/articles")
            }).catch(error => {
                console.error("Failed to update article:", error)
                setLoading(false)
            })
        } else {
            createArticle(formData).then(data => {
                console.log(data)
                const created = data?.article || data
                if (created) {
                    dispatch(addArticle(created))
                }
                navigate("/articles")
            }).catch(error => {
                console.error("Failed to create article:", error)
                setLoading(false)
            })
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-10 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-[#0A1E63] mb-2 text-center">
                {isEdit ? "Edit Article" : "Create Article"}
            </h2>
            <p className="text-sm text-[#6C7A89] mb-6 text-center">
                {isEdit ? "Edit your article" : "Upload a .docx file to create an article"}
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                {isEdit ? (
                    <>
                        <div className="relative">
                            <input
                                type="file"
                                name="file"
                                accept=".docx"
                                required
                                onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                                className="w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 border-[#E9ECF2] rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2B59C3] file:text-white hover:file:bg-[#0A1E63] file:cursor-pointer"
                            />
                            {fileName && (
                                <p className="mt-2 text-sm text-[#6C7A89]">Selected: {fileName}</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="relative">

                            <input
                                type="file"
                                name="file"
                                accept=".docx"
                                required
                                onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                                className="w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 border-[#E9ECF2] rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2B59C3] file:text-white hover:file:bg-[#0A1E63] file:cursor-pointer"
                            />
                            {fileName && (
                                <p className="mt-2 text-sm text-[#6C7A89]">Selected: {fileName}</p>
                            )}
                        </div>
                    </>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 mt-2 text-white rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-300 ${loading ? 'bg-[#9BB3F0] cursor-not-allowed' : 'bg-[#2B59C3] hover:bg-[#0A1E63] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(43,89,195,0.3)]'}`}
                >
                    {loading ? 'Uploading...' : (isEdit ? "Update Article" : "Upload & Create")}
                </button>
            </form>
        </div>
    )
}