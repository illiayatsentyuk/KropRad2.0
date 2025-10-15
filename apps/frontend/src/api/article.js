export const fetchArticles = async () => {
    const response = await fetch('http://localhost:3000/articles')
    const data = await response.json()
    return data
}

export const createArticle = async (formData, accessToken) => {
    const response = await fetch('http://localhost:3000/articles', {
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
    const response = await fetch(`http://localhost:3000/articles/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    const data = await response.json()
    return data
}

export const fetchArticleById = async (id) => {
    const response = await fetch(`http://localhost:3000/articles/${id}`)
    const data = await response.json()
    return data
}

export const updateArticle = async (id, article, accessToken) => {
    const response = await fetch(`http://localhost:3000/articles/${id}`, {
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
    const response = await fetch('http://localhost:3000/reaction', {
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
    const response = await fetch(`http://localhost:3000/reaction/average/${articleId}`, {
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
    const response = await fetch(`http://localhost:3000/reaction/distribution/${articleId}`, {
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