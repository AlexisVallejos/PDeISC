import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { TemaProvider } from './Context/TemaProvider.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemaProvider><App /></TemaProvider>
  </StrictMode>,
)
