import * as React from "react"
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import './index.css'

const store = new Store()  // proxyStore
const theme = createTheme()

store.ready().then(() => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = ReactDOM.createRoot(container!)
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App store={store} />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  )
})
