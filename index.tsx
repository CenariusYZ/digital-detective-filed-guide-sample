import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("🕵️‍♂️ Terminal: Attempting to mount App...");

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
  console.log("🕵️‍♂️ Terminal: Render call issued.");
} else {
  console.error("🕵️‍♂️ Terminal Error: Root element not found!");
}