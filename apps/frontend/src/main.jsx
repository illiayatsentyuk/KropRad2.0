import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './store/store'
import { Provider } from 'react-redux'
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Analytics />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
