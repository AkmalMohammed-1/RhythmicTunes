import React, { useState } from 'react'
import { Layout } from './components/Layout'
import { HomePage } from './components/HomePage'
import { LibraryPage } from './components/ui/LibraryPage'

export const App = () => {
  const [currentPage, setCurrentPage] = useState('home')

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  return (
    <Layout onNavigate={handleNavigate}>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'library' && <LibraryPage />}
    </Layout>
  )
}

export default App