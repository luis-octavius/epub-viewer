import App from './App.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Epub from './components/EpubArea';
import './index.css'

createRoot(document.getElementById('root')).render(
    <App />
)
