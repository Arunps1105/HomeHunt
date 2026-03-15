import { Route, Routes } from "react-router-dom"
import GuestLayout from "../Guest/Guestlayout/GuestLayout"
import AdminLayout from "../Admin/Adminlayout/AdminLayout"
import UserLayout from "../User/Userlayout/Userlayout"
import Ownerlayout from "../Owner/Ownerlayout/Ownerlayout"



const GlobalRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<GuestLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="guest/*" element={<GuestLayout />} />
      <Route path="User/*" element={<UserLayout />} />
      <Route path="Owner/*" element={<Ownerlayout />} />

    </Routes>
  )
}
export default GlobalRoutes