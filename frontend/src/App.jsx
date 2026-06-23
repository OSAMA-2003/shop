import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Home from './pages/Home'
import SignUp from './components/SignUp'
import Verify from './pages/Verify'
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'
import Product from './pages/Product'
import Navbar from './components/Navbar'
import ShopContextProvider from './context/ShopContenxt'
import Footer from './components/Footer'
import Order from './pages/Order'
import { Toaster } from 'react-hot-toast'

// Mockup generator pages
import Mockups from './pages/Mockups'
import MockupCustomizer from './pages/MockupCustomizer'
import Profile from './pages/Profile'


function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            border: '3px solid black',
            padding: '16px',
            color: 'black',
            fontWeight: '900',
            textTransform: 'uppercase',
            borderRadius: '0',
            background: '#F5F2EB',
            fontFamily: "'Roboto', sans-serif",
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          }
        }}
      />

      <ShopContextProvider>

        <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/myorders' element={<MyOrders />} />
        <Route path='/order' element={<Order />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/mockups' element={<Mockups />} />
        <Route path='/mockups/:id' element={<MockupCustomizer />} />
      </Routes>
    </ShopContextProvider>
   
    </>
  )
}

export default App
