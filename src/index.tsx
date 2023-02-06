import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
 
import RootApp from './vd-app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);

