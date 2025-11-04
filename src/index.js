import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import SignIn from './signIn';
import Registration from './registration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('main'));

root.render(
  <React.StrictMode>
    <SignIn />
  </React.StrictMode>
);
reportWebVitals();
