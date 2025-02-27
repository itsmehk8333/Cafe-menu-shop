import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from '../Components/Homepage/Homepage'
import MenuComponent from '../Components/Menu/Menu'
import AdminPage from '../Admin/AdminPage'

function RouterComponent() {
  return (
    <Routes>
        <Route path='/' element={<Homepage />}></Route>
        <Route  path='/menu' element={<MenuComponent />}></Route>
        <Route path='/admin' element={<AdminPage />}></Route>
    </Routes>
  )
}

export default RouterComponent