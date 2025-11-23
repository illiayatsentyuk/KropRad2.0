const API_ORIGIN = import.meta.env.VITE_API_URL ?? 'https://krop-rad2-0-backend.vercel.app/'

export const fetchArticles = async () => {
    console.log(import.meta.env)
    const response = await fetch(`${API_ORIGIN}/articles`)
    const data = await response.json()
    return data
}

export const createArticle = async (formData, accessToken) => {
    const response = await fetch(`${API_ORIGIN}/articles`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    const data = await response.json()
    return data
}

export const deleteArticle = async (id, accessToken) => {
    const response = await fetch(`${API_ORIGIN}/articles/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    const data = await response.json()
    return data
}

export const fetchArticleById = async (id) => {
    const response = await fetch(`${API_ORIGIN}/articles/${id}`)
    const data = await response.json()
    return data
}

export const updateArticle = async (id, article, accessToken) => {
    const response = await fetch(`${API_ORIGIN}/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(article),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    const data = await response.json()
    return data
}

export const submitArticleRating = async (articleId, rating, fingerprint) => {
    const response = await fetch(`${API_ORIGIN}/reaction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ articleId, rating, fingerprint })
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.message || 'Failed to submit rating')
    }
    return response.json()
}

export const fetchArticleAverageRating = async (articleId, accessToken) => {
    const response = await fetch(`${API_ORIGIN}/reaction/average/${articleId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.message || 'Failed to fetch average rating')
    }
    return response.json()
}

export const fetchArticleRatingDistribution = async (articleId, accessToken) => {
    const response = await fetch(`${API_ORIGIN}/reaction/distribution/${articleId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.message || 'Failed to fetch rating distribution')
    }
    return response.json()
}