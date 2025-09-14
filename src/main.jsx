import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AutomatonProvider } from './store/AutomatonContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AutomatonProvider>
        <App />
      </AutomatonProvider>
    </BrowserRouter>
  </React.StrictMode>
)