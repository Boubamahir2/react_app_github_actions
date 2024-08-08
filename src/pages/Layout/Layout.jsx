import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'

// The JSX code consists of three components: Header, Outlet, and Footer.
// <Header /> represents the rendering of the Header component.
// <Outlet /> represents a placeholder where the content of the currently active route will be rendered. It is a special component provided by the react-router-dom library.
// <Footer /> represents the rendering of the Footer component.
function Layout() {
  return (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
  )
}

export default Layout