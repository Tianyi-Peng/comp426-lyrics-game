import React from 'react';
import ReactDOM from 'react-dom';
import "bulma"; 
import AppFrame from './App';

// We add the CORS header here because we want our page to be able to be modified by pages from other origins
<meta http-equiv="Access-Control-Allow-Origin" content="*" />
ReactDOM.render(
  <React.StrictMode>
    <AppFrame />
  </React.StrictMode>,
  document.getElementById('root')
);
