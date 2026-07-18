import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './fonts.css';
import './index.css';

function mount() {
  const el = document.getElementById('root');
  if (el) createRoot(el).render(<React.StrictMode><App /></React.StrictMode>);
}
// default light; the gate flips data-theme on <html> and the CSS follows it. restore persisted choice.
if (!document.documentElement.getAttribute('data-theme')) {
  let t = 'light';
  try { t = localStorage.getItem('illum-theme') || 'light'; } catch {}
  document.documentElement.setAttribute('data-theme', t);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
