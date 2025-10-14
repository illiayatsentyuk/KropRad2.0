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