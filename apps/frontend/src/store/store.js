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
export const { setArticles, addArticle, updateArticle, deleteArticle } = articlesSlice.actions;
export const store = configureStore({ reducer: { user: userSlice.reducer, articles: articlesSlice.reducer }});