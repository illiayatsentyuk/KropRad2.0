import axios from "axios"
const API_ORIGIN = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

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

export const fetchMe = async (accessToken) => {
    const response = await axios.get(`${API_ORIGIN}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    return response.data
}

export const fetchLogout = async (accessToken) => {
    try {
        const response = await axios.post(`${API_ORIGIN}/auth/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
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