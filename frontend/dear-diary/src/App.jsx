import React from 'react'
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom"

import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"
import Home from "./pages/Home/Home"

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' exact element={<Root/>} />
          <Route path='/dashboard' exact element={<Home/>} />
          <Route path='/login' exact element={<Login/>} />
          <Route path='/signup' exact element={<SignUp/>} />
        </Routes>
      </Router>
    </div>
  )
}

const Root = () => {
  const isAuthenticated = localStorage.getItem('token') ? true : false;
  return (
    isAuthenticated ? <Navigate to='dashboard'/> : <Navigate to='login' /> 
  )
}

export default App
