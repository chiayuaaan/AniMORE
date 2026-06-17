import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css' /* Variables load first */
import './index.css'            /* Global styles load second */
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)