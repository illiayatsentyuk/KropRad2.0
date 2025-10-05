export const fetchSignin = async (email, password) => {
    const response = await fetch('http://localhost:3000/auth/local/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data
}

export const fetchSignup = async (name, email, password) => {
    const response = await fetch('http://localhost:3000/auth/local/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data
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