import React from 'react'
import LOGO from '../assets/images/logo.png'
import Profile from './Profile'
import SearchBar from './SearchBar'

const Navbar = ({userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch}) => {

  const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = async () => {
    handleClearSearch();
    setSearchQuery("");
  }

  return (
    
    <div className='bg-white drop-shadow flex items-center justify-between px-4 py-2 top-0 z-10'>
      <img src={LOGO} alt="Travel diary" />
      <SearchBar
      value={searchQuery}
      onChange={({target}) => {
        setSearchQuery(target.value);
      }}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}
      />
      <Profile userInfo={userInfo}/>
    </div>

  )
}

export default Navbar
