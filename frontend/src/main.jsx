// Browser entry point. Vite loads this module from index.html, Tailwind's global
// stylesheet is imported once, and React mounts the entire application into #root.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Find the empty root element in index.html and place the React website inside it.
createRoot(document.getElementById('root')).render(
  // StrictMode helps point out common React mistakes while developing the website.
  <StrictMode>
    <App />
  </StrictMode>,
)
