import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import GlobalStyles from './components/styles/globalStyles.js';
import { registerServiceWorker } from './serviceWorker'


ReactDOM.render(
<React.Fragment>
<GlobalStyles/>
<App />
</React.Fragment>,
 document.getElementById('app'));

 registerServiceWorker();



