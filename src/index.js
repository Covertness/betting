import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login';
import registerServiceWorker from './registerServiceWorker';

// material-ui need it. https://stackoverflow.com/questions/26962341/number-isnan-doesnt-exist-in-ie
Number.isNaN = (o) => typeof (o) === 'number' && isNaN(o);

if (localStorage.getItem('token') == null) {
    ReactDOM.render(<Login />, document.getElementById('root'));
} else {
    ReactDOM.render(<App />, document.getElementById('root'));
}
// registerServiceWorker();
