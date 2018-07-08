import React from 'react'
import { connect } from 'react-redux'
import Login from '../containers/Login'
import Main from '../containers/Main'

const App = ({ logged }) => {
    if (logged) {
        return <Main />
    } else {
        return <Login />
    }
}

const mapStateToProps = state => ({
    logged: state.userInfo != null
})

export default connect(mapStateToProps)(App)