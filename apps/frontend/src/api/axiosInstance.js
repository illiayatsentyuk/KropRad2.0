import axios from 'axios';

const API_ORIGIN = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_ORIGIN,
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // No refresh token available, logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/signin';
                return Promise.reject(error);
            }

            try {
                // Call refresh endpoint directly to avoid circular dependency
                const response = await axios.post(`${API_ORIGIN}/auth/refresh`, {}, {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const { access_token, refresh_token } = response.data;

                // Store new tokens
                localStorage.setItem('accessToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);

                // Update authorization header
                axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
                originalRequest.headers['Authorization'] = 'Bearer ' + access_token;

                // Process queued requests
                processQueue(null, access_token);

                // Retry original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                processQueue(refreshError, null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                // Dispatch logout event for Redux store
                window.dispatchEvent(new Event('token-expired'));
                
                // Redirect to signin
                if (window.location.pathname !== '/signin') {
                    window.location.href = '/signin';
                }
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

