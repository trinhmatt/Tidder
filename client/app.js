import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './routes/AppRouter'
import configureStore from '../store/configureStore'

const store = configureStore();

ReactDOM.render(<AppRouter />, document.getElementById('app'))
