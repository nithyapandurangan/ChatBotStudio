import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from '../src/components/Toaster.jsx' 
import { ThemeProvider } from '../src/components/ThemeProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <App />
    <Toaster />
    </ThemeProvider>
  </StrictMode>,
)
