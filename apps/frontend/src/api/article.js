import axios from "axios"
import axiosInstance from "./axiosInstance"
import { cacheFirst, staleWhileRevalidate, invalidateCache, invalidateCachePattern } from "../utils/cacheApi"

const API_ORIGIN = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Helper to build full URL for cache keys
const buildCacheUrl = (path) => `${API_ORIGIN}${path}`

/**
 * Fetch all articles with caching
 * Uses cache-first strategy for fast loading
 */
export const fetchArticles = async (options = {}) => {
    const url = buildCacheUrl('/articles')
    
    return cacheFirst(
        url,
        async () => {
            console.log(import.meta.env)
            const response = await axiosInstance.get('/articles')
            return response.data
        },
        options
    )
}

/**
 * Create new article - invalidates articles cache
 */
export const createArticle = async (formData) => {
    const response = await axiosInstance.post('/articles', formData)
    
    // Invalidate articles list cache
    await invalidateCachePattern('/articles')
    
    return response.data
}

/**
 * Delete article - invalidates related caches
 */
export const deleteArticle = async (id) => {
    const response = await axiosInstance.delete(`/articles/${id}`)
    
    // Invalidate both the specific article and articles list
    await invalidateCache(buildCacheUrl(`/articles/${id}`))
    await invalidateCachePattern('/articles')
    
    return response.data
}

/**
 * Fetch single article by ID with caching
 * Uses stale-while-revalidate for instant display with background updates
 */
export const fetchArticleById = async (id, options = {}) => {
    const url = buildCacheUrl(`/articles/${id}`)
    
    return staleWhileRevalidate(
        url,
        async () => {
            const response = await axiosInstance.get(`/articles/${id}`)
            return response.data
        },
        options
    )
}

/**
 * Update article - invalidates related caches
 */
export const updateArticle = async (id, article) => {
    const response = await axiosInstance.put(`/articles/${id}`, article, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    // Invalidate both the specific article and articles list
    await invalidateCache(buildCacheUrl(`/articles/${id}`))
    await invalidateCachePattern('/articles')
    
    return response.data
}

/**
 * Submit article rating - invalidates rating caches
 */
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
        
        // Invalidate rating caches for this article
        await invalidateCache(buildCacheUrl(`/reaction/average/${articleId}`))
        await invalidateCache(buildCacheUrl(`/reaction/distribution/${articleId}`))
        
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to submit rating'
        throw new Error(message)
    }
}

/**
 * Fetch article average rating with caching
 */
export const fetchArticleAverageRating = async (articleId, options = {}) => {
    const url = buildCacheUrl(`/reaction/average/${articleId}`)
    
    try {
        return await cacheFirst(
            url,
            async () => {
                const response = await axiosInstance.get(`/reaction/average/${articleId}`)
                return response.data
            },
            options
        )
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch average rating'
        throw new Error(message)
    }
}

/**
 * Fetch article rating distribution with caching
 */
export const fetchArticleRatingDistribution = async (articleId, options = {}) => {
    const url = buildCacheUrl(`/reaction/distribution/${articleId}`)
    
    try {
        return await cacheFirst(
            url,
            async () => {
                const response = await axiosInstance.get(`/reaction/distribution/${articleId}`)
                return response.data
            },
            options
        )
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch rating distribution'
        throw new Error(message)
    }
}