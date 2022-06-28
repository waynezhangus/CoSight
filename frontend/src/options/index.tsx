import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'

import Home from './pages/Home'
import Intro from './pages/Intro'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Settings from './pages/Settings'
import Manual from './pages/Manual'

const theme = createTheme()

const container = document.createElement('div')
container.id = 'root'
document.body.appendChild(container)
const root = ReactDOM.createRoot(container!)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' element={<Home />}>
            <Route path='/intro' element={<Intro />} />
            <Route path='/manual' element={<Manual />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
)

