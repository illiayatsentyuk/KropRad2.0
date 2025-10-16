import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const Article = ({ title, description, author, id, handleDelete, handleEditArticle }) => {

    const user = useSelector((state) => state.user.user)
    const isAdmin = user?.role === 'admin'

    return (
        <div className="flex justify-center flex-col gap-3 bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-[#E9ECF2] transition-all duration-300 hover:shadow-lg hover:border-[#3F7EF7] hover:-translate-y-0.5">

            <h2 className="text-xl sm:text-2xl font-bold text-[#0A1E63] leading-tight line-clamp-3">
                <Link to={`/article/${id}`}>
                    {title}
                </Link>
            </h2>
            {description ? (
                <p className="text-sm sm:text-[15px] text-[#1E1E1E] leading-relaxed line-clamp-3">
                    {description}
                </p>
            ) : null}
            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[#E9ECF2]">
                <svg className="w-5 h-5 text-[#6C7A89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {author ? (
                    <span className="text-sm font-medium text-[#6C7A89]">
                        {author}
                    </span>
                ) : null}
            </div>
            {isAdmin && (
                <div className="flex justify-between items-center gap-2 mt-2 pt-3 border-t border-[#E9ECF2]">
                    <button className="text-sm font-medium text-[#6C7A89] hover:text-[#3F7EF7]" onClick={() => handleEditArticle(id)}>Edit</button>
                    <button className="text-sm font-medium text-[#6C7A89] hover:text-[#3F7EF7]" onClick={() => handleDelete(id)}>Delete</button>
                </div>
            )}
        </div>
    )
}