import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
function mount() { createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>) }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount)
else mount()
