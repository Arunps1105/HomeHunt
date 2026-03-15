import React from 'react'
import { Route, Routes } from 'react-router'
import Login from '../Guest/Pages/Login/Login'
import Registeration from '../Guest/Pages/Registeration/Registeration'
import Dashboard from '../Guest/Pages/Dashboard/Dashboard'
import OwnerReg from '../Guest/Pages/OwnerReg/OwnerReg'

const GuestRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='login' element={<Login />}></Route>
        <Route path='Registeration' element={<Registeration />}></Route>
        <Route path='OwnerReg' element={<OwnerReg />}></Route>
        <Route path='' element={<Dashboard />}></Route>
      </Routes>
    </div>
  )
}

export default GuestRoutes
