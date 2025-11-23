import axios from "axios"
import axiosInstance from "./axiosInstance"

// Remove trailing slash from API_ORIGIN if present
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export const fetchArticles = async () => {
    console.log(import.meta.env)
    const response = await axiosInstance.get('/articles')
    return response.data
}

export const createArticle = async (formData) => {
    const response = await axiosInstance.post('/articles', formData)
    return response.data
}

export const deleteArticle = async (id) => {
    const response = await axiosInstance.delete(`/articles/${id}`)
    return response.data
}

export const fetchArticleById = async (id) => {
    const response = await axiosInstance.get(`/articles/${id}`)
    return response.data
}

export const updateArticle = async (id, article) => {
    const response = await axiosInstance.put(`/articles/${id}`, article, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data
}

export const submitArticleRating = async (articleId, rating, fingerprint) => {
    try {
        const response = await axiosInstance.post('/reaction', 
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

export const fetchArticleAverageRating = async (articleId) => {
    try {
        const response = await axiosInstance.get(`/reaction/average/${articleId}`)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch average rating'
        throw new Error(message)
    }
}

export const fetchArticleRatingDistribution = async (articleId) => {
    try {
        const response = await axiosInstance.get(`/reaction/distribution/${articleId}`)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch rating distribution'
        throw new Error(message)
    }
}