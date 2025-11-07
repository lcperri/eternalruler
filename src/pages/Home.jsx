import React from 'react'
import BooksList from '../components/BooksList'
import NavBar from '../components/NavBar'
import { useState } from 'react'

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('')
  
    const onSearchChange = (inputValue) =>{
      setSearchQuery(inputValue)
    }

  return (
    <>
      <NavBar onSearchChange = { onSearchChange } searchQuery = { searchQuery }/>
      <BooksList searchQuery = { searchQuery }/>
    </>
  )
}

export default Home