const parseError = async (response) => {
    let message = `Request failed with status ${response.status}`
    let details = null
    try {
        const data = await response.json()
        if (Array.isArray(data?.message)) {
            message = data.message.join('\n')
            details = data.message
        } else if (typeof data?.message === 'string') {
            message = data.message
        } else if (typeof data?.error === 'string') {
            message = data.error
        }
        return { message, details, raw: data }
    } catch (e) {
        return { message, details, raw: null }
    }
}

export const fetchSignin = async (email, password) => {
    const response = await fetch('http://localhost:3000/auth/local/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) {
        const err = await parseError(response)
        throw new Error(err.message)
    }
    return response.json()
}

export const fetchSignup = async (name, email, password) => {
    const response = await fetch('http://localhost:3000/auth/local/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) {
        const err = await parseError(response)
        throw new Error(err.message)
    }
    return response.json()
}

export const fetchMe = async (accessToken) => {
    const response = await fetch('http://localhost:3000/auth/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    const data = await response.json()
    return data
}

export const fetchLogout = async (accessToken) => {
    const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(response.status === 200) {
        return {message: "Logged out"}
    }
    return {message: "Failed to logout"}
}