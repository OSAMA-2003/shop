import { React, useState } from 'react'
import Add from './components/AddProduct.jsx'
import List from './components/List.jsx'
import Orders from './components/Orders.jsx'
import Sidebar from './components/Sidebar.jsx'
import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import AdminLogin from './components/AdminLogin.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Toaster } from 'react-hot-toast'
import Users from './components/Users.jsx'
import AddMockup from './components/AddMockup.jsx'
import MockupsList from './components/MockupsList.jsx'
import Notifications from './components/Notifications.jsx'
import DashboardHome from './components/DashboardHome.jsx'

function App() {

  return (
    <>

      <Toaster/>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Navigate to='/admin' />} />
        <Route path='/admin/login' element={<AdminLogin />} />

        <Route path='/admin' element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        } />
        
        <Route path='/admin/' element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        } />
       
        <Route path='/admin/products-list' element={
          <ProtectedRoute>
            <List />
          </ProtectedRoute>
        } />
       
        <Route path='/admin/add' element={
          <ProtectedRoute>
            <Add />
          </ProtectedRoute>} />

        <Route path='/admin/mockups' element={
          <ProtectedRoute>
            <AddMockup />
          </ProtectedRoute>
        } />

        <Route path='/admin/mockups-list' element={
          <ProtectedRoute>
            <MockupsList />
          </ProtectedRoute>
        } />

        <Route path='/admin/orders' element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />


        <Route path='/admin/user' element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />

       <Route path='/admin/notifications' element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />



      </Routes>


      


    </>
  )
}

export default App
