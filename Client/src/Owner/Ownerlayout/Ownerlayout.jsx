import React from 'react'
import Sidebar from '../Components/Sidebar/Sidebar'
import OwnerRoutes from'../../Routes/OwnerRoutes'
import Navbar from '../Components/Navbar/Navbar'
const Ownerlayout = () => {
  return (
    <>
      <Sidebar />
  <OwnerRoutes />
  <Navbar />


    </>
  )
}

export default Ownerlayout