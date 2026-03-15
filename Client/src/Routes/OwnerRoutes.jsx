import React from 'react'
import { Route, Routes } from 'react-router'
import Dashboard from '../Owner/Pages/Dashboard/Dashboard'
import House from '../Owner/Pages/House/House'
import Profile from '../Owner/Pages/Myprofile/Myprofile'
import EditProfile from '../Owner/Pages/Editprofile/Editprofile'
import ChangePassword from '../Owner/Pages/Changepassword/Changepassword'
import Gallery from '../Owner/Pages/Gallery/Gallery'
import OwnerRequests from '../Owner/Pages/Ownerreq/Ownerreq'
import OwnerMyHouses from '../Owner/Pages/Myhouse/OwnerMyHouses'
import EditHouse from '../Owner/Pages/Edithouse/EditHouse'
import OwnerChatView from "../Owner/Pages/Chatss/OwnerChats";
import OwnerChat from "../Owner/Pages/Chat/OwnerChat";
import OwnerComplaint from '../Owner/Pages/OwnerComplaint/OwnerComplaint'


const GuestRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='' element={<Dashboard />}></Route>
        <Route path='House' element={<House />}></Route>
        <Route path="Myprofile" element={<Profile />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="Editprofile" element={<EditProfile />} />
        <Route path="ChangePassword" element={<ChangePassword />} />
        <Route path="Gallery" element={<Gallery />} />
        <Route path="requests" element={<OwnerRequests />} />
        <Route path="OwnerMyHouses" element={<OwnerMyHouses />} />
        <Route path="EditHouse/:id" element={<EditHouse />} />
        <Route path="Chats" element={<OwnerChatView />} />
        <Route path="OwnerComplaint" element={<OwnerComplaint />} />
        <Route path="/chat/:id" element={<  OwnerChat />} />


      </Routes>
    </div>
  )
}

export default GuestRoutes
