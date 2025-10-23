import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    setUser: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      },
      clearUser: (state) => {
        state.user = null;
        state.isAuthenticated = false;
      }
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    accessToken: localStorage.getItem('accessToken') || null, 
    refreshToken: localStorage.getItem('refreshToken') || null 
  },
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
})
const articlesSlice = createSlice({
  name: 'articles',
  initialState: { articles: [] },
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    addArticle: (state, action) => {
      state.articles.push(action.payload);
    },
    updateArticle: (state, action) => {
      state.articles = state.articles.map(article => article.id === action.payload.id ? action.payload : article);
    },
    deleteArticle: (state, action) => {
      state.articles = state.articles.filter(article => article.id !== action.payload);
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export const { setTokens, clearTokens } = authSlice.actions;
export const { setArticles, addArticle, updateArticle, deleteArticle } = articlesSlice.actions;
export const store = configureStore({ 
  reducer: { 
    user: userSlice.reducer, 
    auth: authSlice.reducer,
    articles: articlesSlice.reducer 
  }
});

// Listen for token-expired event to clear user and tokens
window.addEventListener('token-expired', () => {
  store.dispatch(clearUser());
  store.dispatch(clearTokens());
});