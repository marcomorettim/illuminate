import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// classic IIFE runs mid-parse under the artifact CSP → mount only once the DOM is ready.
function mount() {
  const el = document.getElementById('root');
  if (el) createRoot(el).render(<React.StrictMode><App /></React.StrictMode>);
}
// restore persisted theme before first paint
try { const t = localStorage.getItem('illum-theme'); if (t) document.documentElement.setAttribute('data-theme', t); } catch {}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
