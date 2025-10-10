import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './store/store'
import { Provider } from 'react-redux'
import {
  FpjsProvider,
  FingerprintJSPro
} from '@fingerprintjs/fingerprintjs-pro-react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FpjsProvider
      loadOptions={{
        apiKey: "RSD772rqZ2rrDQ6PrMEQ",
        endpoint: [
          // "https://metrics.yourwebsite.com", 
          FingerprintJSPro.defaultEndpoint
        ],
        scriptUrlPattern: [
          // "https://metrics.yourwebsite.com/web/v<version>/<apiKey>/loader_v<loaderVersion>.js",
          FingerprintJSPro.defaultScriptUrlPattern
        ],
        // region: "eu"
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </FpjsProvider>
  </StrictMode>,
)
