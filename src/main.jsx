import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Enable debug mode to show formula breakdown
window.EDUCAPTION_DEBUG = true

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
