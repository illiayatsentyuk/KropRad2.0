import axios from "axios"

const API_ORIGIN = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const fetchArticles = async () => {
    console.log(import.meta.env)
    const response = await axios.get(`${API_ORIGIN}/articles`)
    return response.data
}

export const createArticle = async (formData, accessToken) => {
    const response = await axios.post(`${API_ORIGIN}/articles`, formData, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    return response.data
}

export const deleteArticle = async (id, accessToken) => {
    const response = await axios.delete(`${API_ORIGIN}/articles/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    return response.data
}

export const fetchArticleById = async (id) => {
    const response = await axios.get(`${API_ORIGIN}/articles/${id}`)
    return response.data
}

export const updateArticle = async (id, article, accessToken) => {
    const response = await axios.put(`${API_ORIGIN}/articles/${id}`, article, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    return response.data
}

export const submitArticleRating = async (articleId, rating, fingerprint) => {
    try {
        const response = await axios.post(`${API_ORIGIN}/reaction`, 
            { articleId, rating, fingerprint },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to submit rating'
        throw new Error(message)
    }
}

export const fetchArticleAverageRating = async (articleId, accessToken) => {
    try {
        const response = await axios.get(`${API_ORIGIN}/reaction/average/${articleId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch average rating'
        throw new Error(message)
    }
}

export const fetchArticleRatingDistribution = async (articleId, accessToken) => {
    try {
        const response = await axios.get(`${API_ORIGIN}/reaction/distribution/${articleId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch rating distribution'
        throw new Error(message)
    }
}