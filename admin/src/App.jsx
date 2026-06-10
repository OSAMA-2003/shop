import { React, useState } from 'react'
import Add from './components/Add.jsx'
import List from './components/List.jsx'
import Orders from './components/Orders.jsx'
import Sidebar from './components/Sidebar.jsx'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AdminLogin from './components/AdminLogin.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Toaster } from 'react-hot-toast'
import Users from './components/Users.jsx'
import Notifications from './components/Notifications.jsx'

function App() {

  return (
    <>

      <Toaster/>
      <Sidebar />
      <Routes>
        <Route path='/admin/login' element={<AdminLogin />} />
       
        <Route path='/admin/list' element={
          <ProtectedRoute>
            <List />
          </ProtectedRoute>
        } />
       
        <Route path='/admin/add' element={
          <ProtectedRoute>
            <Add />
          </ProtectedRoute>} />

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
