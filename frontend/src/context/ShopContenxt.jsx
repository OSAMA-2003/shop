import { createContext, useEffect, useState } from "react";
import {all_products} from '../assets/data'
import axios from "axios";





export const ShopContext = createContext()
const ShopContextProvider = ({ children }) => {
    
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({}) 
    const [token,setToken] = useState()
    const [loading, setLoading] = useState(true); 
    const url = "http://localhost:5000" 


useEffect(()=>{
    const savedCart = localStorage.getItem("cartItems");
    if(savedCart){
        setCartItems(JSON.parse(savedCart))
    }
},[])


useEffect(()=>{
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
},[cartItems])

const addToCart = async (id, quantity = 1) => {
    const productId = id.toString()
    setCartItems(prev => ({
        ...prev,
        [id]: prev[id] ? prev[id] + quantity : quantity // Use the provided quantity
    }))
    if(token){
        await axios.post(`${url}/api/cart/add`, {id:id}, {headers:{token}})
    }
}


const removeFromCart = async (id, removeAll=false)=>{
    setCartItems(prev=>{
        const updated = {...prev}
        if (removeAll || updated[id] === 1) {
            delete updated[id];
        } else if (updated[id]) {
            updated[id] -= 1;
        }
        return updated
    })
   try{
            await axios.post(`${url}/api/cart/remove`, {id:id, removeAll:removeAll} , {headers:{token}})

   }catch(err){
    console.log(err)
   }
}


const clearCart = async ()=>{
    if(!token) console.log("ERROR")

    try{
        const res = await axios.post(`${url}/api/cart/clear`, {}, {headers:{token}})
        setCartItems({})
    }catch(err){
        console.log(err)
    }

}


const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
        const product = products.find((p) => p._id === String(id));
        return total + (product ? product.price * qty : 0);
    }, 0);
}

const placeOrder = async (orderData) => {
    const orderItems = [];
    products.forEach((product) => {
        if (cartItems[product._id] > 0) {
            // Creating a new object to avoid mutating the original product object from state
            let itemInfo = {...product, quantity: cartItems[product._id]};
            orderItems.push(itemInfo);
        }
    });

    const orderPayload = {
        address: orderData,
        items: orderItems,
        amount: getTotalCartAmount() + 2, // +2 for delivery fee
    };

    try {
        const response = await axios.post(`${url}/api/order/place`, orderPayload, { headers: { token } });
        if (response.data.success) {
            const { session_url } = response.data;
            window.location.replace(session_url);
        } else {
            alert("Error: " + response.data.message);
        }
    } catch (error) {
        alert("An error occurred while placing your order. Please try again.");
    }
};

const fetchProductsList = async ()=>{
    try{
        const res = await axios.get(`${url}/api/product/list`)
        setProducts(res.data.data || [])
    }catch(err){
        console.log(err)
        setProducts(all_products)
    }
}


const loadCartData = async(token)=> {

    const res = await axios.get(`${url}/api/cart/get`, {headers:{token}})
    setCartItems(res.data.cartData)
}


useEffect(()=>{

    async function loadData() {
        setLoading(true);
        await fetchProductsList()
        if(localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
            await loadCartData(localStorage.getItem('token'))
        }
        setLoading(false);
    }
    loadData()
}, [])


const value ={
    cartItems,
    all_products:products, 
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    url,
    setToken,
    clearCart,
    setCartItems,
    placeOrder, // Export the new function
    loading // Export loading state
}


return <ShopContext.Provider value={value}> {children} </ShopContext.Provider>

}


export default ShopContextProvider
