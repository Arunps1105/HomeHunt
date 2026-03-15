import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Sidebar from '../Components/Sidebar/Sidebar'
import AdminRoutes from '../../Routes/AdminRoutes'

const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <AdminRoutes />


    </>
  )
}

export default AdminLayout
