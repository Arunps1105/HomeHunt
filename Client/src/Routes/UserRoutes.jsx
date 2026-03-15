import React from 'react'
import { Route, Routes } from "react-router-dom"
import Profile from '../User/Pages/Myprofile/Myprofile'
import EditProfile from '../User/Pages/Editprofile/Editprofile'
import ChangePassword from '../User/Pages/Changepassword/Changepassword'
import Dashboard from '../User/Pages/Dashboard/Dashboard'
import Requested from '../User/Pages/Request/Requested'
import FavouritesPage from '../User/Pages/Favourites/FavouritesPage'
import UserFloorType from '../User/Pages/UserFloortype/UserFloortype'
import UserBhkType from '../User/Pages/UserBhktype/Userbhktype'
import ViewHouse from '../User/Pages/Viewhouse.jsx/Viewhouse'
import UserGallery from '../User/Pages/Usergallery/UserGallery'
import Complaint from '../User/Pages/Complaint/Complaint'
import Feedback from '../User/Pages/Feedback/Feedback'
import PaymentGateway from '../User/Pages/payment/payment'
import Recommend from '../User/Pages/Recommendation/Recommend'
import UserChat from '../User/Pages/Chat/Chat'
import ForgotPassword from "../User/Pages/ForgotPassword/ForgotPassword";

const UserRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="Myprofile" element={<Profile />} />
        <Route path="Editprofile" element={<EditProfile />} />
        <Route path="ChangePassword" element={<ChangePassword />} />
        <Route path="Requested" element={<Requested />} />
        <Route path='FavouritesPage' element={<FavouritesPage />}></Route>
        <Route path='UserFloorType' element={<UserFloorType />}></Route>
        <Route path='UserBhkType' element={<UserBhkType />}></Route>
        <Route path='Viewhouse' element={<ViewHouse />}></Route>
        <Route path='UserGallery/:id' element={<UserGallery />}></Route>
        <Route path='Complaint' element={<Complaint />}></Route>
        <Route path='' element={<Dashboard />}></Route>
        <Route path="Feedback" element={<Feedback />} />
        <Route path="Payment/:id" element={<PaymentGateway />} />
        <Route path="chat/:id" element={<UserChat />} />
        <Route path="Recommend" element={<Recommend />} />
        <Route path="/ForgotPassword" element={<ForgotPassword/>} />
      </Routes>
    </div>
  )
}

export default UserRoutes
