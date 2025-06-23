import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { initTranslations } from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root')!);

initTranslations(localStorage.getItem('lang') || 'de')
  .then(() => {
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  })
  .catch(console.error);