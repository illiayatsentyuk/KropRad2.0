import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { MainLayout } from './layouts/MainLayout'
import { HeroPage } from './pages/HeroPage'
import { ArticlesPage } from './pages/Articles'
import { NotFoundPage } from './pages/404'
import { fetchMe } from './api/auth'
import { AdminLayout } from './layouts/AdminLayout'
import { CreateArticle } from './pages/CreateArticle'
import { setUser, clearUser } from './store/store'
import { useDispatch } from 'react-redux'
import { ArticlePage } from './pages/Article'
import { AboutPage } from './pages/About'
import MapComponent from './components/MapComponent'

function App() {
  const dispatch = useDispatch()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken")
    const accessToken = localStorage.getItem("accessToken")
    if (refreshToken && accessToken) {
      fetchMe().then(data => {
        if (data.role === "admin") {
          dispatch(setUser(data.user))
          setIsAdmin(true)
          setIsAuthenticated(true)
        } else {
          dispatch(clearUser())
        }
      }).catch(error => {
        console.log("Failed to fetch user:", error)
        dispatch(clearUser())
      })
    }
  }, [])

  let routes = (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/auth" element={<AuthPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HeroPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/map" element={<MapComponent />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )

  if (isAdmin && isAuthenticated) {
    routes = (
      <BrowserRouter>
        <Routes>
          <Route path="/admin/auth" element={<AuthPage />} />
          <Route path="/" element={<AdminLayout />}>
            <Route path="/" element={<HeroPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/edit-article/:id" element={<CreateArticle />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/map" element={<MapComponent />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <>
      {routes}
    </>
  )
}

export default App
