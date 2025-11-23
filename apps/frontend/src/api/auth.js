import axios from "axios"
import axiosInstance from "./axiosInstance"

// Remove trailing slash from API_ORIGIN if present
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

const parseError = (error) => {
    let message = 'Request failed'
    let details = null

    if (error.response) {
        const data = error.response.data
        if (Array.isArray(data?.message)) {
            message = data.message.join('\n')
            details = data.message
        } else if (typeof data?.message === 'string') {
            message = data.message
        } else if (typeof data?.error === 'string') {
            message = data.error
        } else {
            message = `Request failed with status ${error.response.status}`
        }
        return { message, details, raw: data }
    }

    return { message: error.message || message, details, raw: null }
}

export const fetchSignin = async (email, password) => {
    try {
        const response = await axios.post(`${API_ORIGIN}/auth/local/signin`,
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response.data
    } catch (error) {
        const err = parseError(error)
        throw new Error(err.message)
    }
}

export const fetchSignup = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_ORIGIN}/auth/local/signup`,
            { name, email, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response.data
    } catch (error) {
        const err = parseError(error)
        throw new Error(err.message)
    }
}

export const fetchMe = async () => {
    const response = await axiosInstance.get('/auth/me')
    return response.data
}

export const fetchLogout = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout', {}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200) {
            return { message: "Logged out" }
        }
        return { message: "Failed to logout" }
    } catch (error) {
        return { message: "Failed to logout" }
    }
}

export const fetchRefreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_ORIGIN}/auth/refresh`, {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        const err = parseError(error)
        throw new Error(err.message)
    }
}