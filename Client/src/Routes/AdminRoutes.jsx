import React from 'react'
import { Route, Routes } from 'react-router'
import AdminReg from "../Admin/Pages/AdminReg/AdminReg"
import District from '../Admin/Pages/District/District'
import Place from '../Admin/Pages/Place/Place'
import Dashboard from '../Admin/Pages/Dashboard/Dashboard'
import Bhktype from '../Admin/Pages/Bhktype/Bhktype'
import FloorType from '../Admin/Pages/Floortype/Floortype'
import Tenenttype from '../Admin/Pages/Tenenttype/Tenenttype'
import ViewComplaint from '../Admin/Pages/Viewcomplaint/Viewcomplaint'
import AdminViewFeedback from '../Admin/Pages/ViewFeedback/ViewFeedback'
import AdminUserList from '../Admin/Pages/Viewuserlist/AdminUserList'
import AdminOwnerList from '../Admin/Pages/Ownerlist/AdminOwnerList'
import AdminComplaint from '../Admin/Pages/ViewOwnerComplaint/AdminComplaint'

const AdminRoutes = () => {
   return (
      <Routes>
         <Route path="AdminReg" element={<AdminReg />} />
         <Route path="District" element={< District />} />
         <Route path="Place" element={<Place />} />
         <Route path='FloorType' element={<FloorType />}></Route>
         <Route path='Bhktype' element={<Bhktype />}></Route>
         <Route path="Tenenttype" element={<Tenenttype />} />
         <Route path="ViewComplaint" element={<ViewComplaint />} />
         <Route path='' element={<Dashboard />}></Route>
         <Route path="ViewFeedback" element={<AdminViewFeedback />} />
         <Route path="AdminUserList" element={<AdminUserList />} />
         <Route path="AdminOwnerList" element={<AdminOwnerList />} />
         <Route path="AdminComplaint" element={<AdminComplaint/>} />




      </Routes>
   )
}

export default AdminRoutes
