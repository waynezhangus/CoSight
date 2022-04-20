import React from 'react'
import ReactDOM from 'react-dom/client'
import './popup.css'

const App: React.FC<{}> = () => {
  return (
    <div>
      <img src="icon.png" />
    </div>
  )
}

const root = ReactDOM.createRoot(document.body!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
