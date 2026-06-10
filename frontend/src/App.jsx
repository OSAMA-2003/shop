import { Route, Routes } from 'react-router-dom'
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


function App() {

  return (
    <>

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
      </Routes>
    </ShopContextProvider>
   
    </>
  )
}

export default App
