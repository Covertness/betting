import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
// import registerServiceWorker from './registerServiceWorker'
import './index.css'
import App from './components/App'
import rootReducer from './reducers'

// material-ui need it. https://stackoverflow.com/questions/26962341/number-isnan-doesnt-exist-in-ie
Number.isNaN = (o) => typeof (o) === 'number' && isNaN(o)

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware
    ))

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
// registerServiceWorker()