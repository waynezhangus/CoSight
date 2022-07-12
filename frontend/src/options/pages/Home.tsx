import * as React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <div style={{height: 'calc(100vh - 64px)', overflow: 'auto'}}>
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
