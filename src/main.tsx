import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { clearPersistedDesktopStateOnReload } from './utils/clearPersistedStateOnReload'
import './styles/index.css'

clearPersistedDesktopStateOnReload()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

