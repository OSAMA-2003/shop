import { createContext, useEffect, useState } from "react";
import {all_products} from '../assets/data'
import axios from "axios";





export const ShopContext = createContext()
const ShopContextProvider = ({ children }) => {
    
    const [products, setProducts] = useState([])
    const [all_mockups, setAllMockups] = useState([]);
    const [customMockups, setCustomMockups] = useState([]);
    const [cartItems, setCartItems] = useState({}) 
    const [token,setToken] = useState()
    const [loading, setLoading] = useState(true); 
    const url = "https://shop-2-ms77.onrender.com" 


    // Fetch user's cart from backend when token changes (login/logout)
    useEffect(() => {
        const syncCart = async () => {
            if (token) {
                setLoading(true);
                try {
                    await Promise.all([
                        loadCartData(token),
                        fetchCustomMockups(token)
                    ]);
                } catch (err) {
                    console.error("Error syncing cart data:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                // Clear cart state on client side only when logged out
                setCartItems({});
                setCustomMockups([]);
                setLoading(false);
            }
        };
        syncCart();
    }, [token]);

const addToCart = async (id, quantity = 1, size = 'M') => {
    const cartKey = id.includes('_') ? id : `${id}_${size}`;
    const [productId, itemSize] = cartKey.split('_');
    setCartItems(prev => ({
        ...prev,
        [cartKey]: (prev[cartKey] || 0) + quantity
    }))
    if(token){
        await axios.post(`${url}/api/cart/add`, {id: productId, size: itemSize, quantity: quantity}, {headers:{token}})
    }
}

const removeFromCart = async (id, size = 'M', removeAll=false)=>{
    // Find the matching key in cartItems, supporting both legacy and size-suffixed formats
    let cartKey = id;
    if (cartItems && !(cartKey in cartItems)) {
        cartKey = id.includes('_') ? id : `${id}_${size}`;
        if (!(cartKey in cartItems)) {
            const [productId] = id.split('_');
            if (productId in cartItems) {
                cartKey = productId;
            }
        }
    }

    const [productId, itemSize] = cartKey.includes('_') ? cartKey.split('_') : [cartKey, size];

    setCartItems(prev=>{
        const updated = {...prev}
        if (removeAll || updated[cartKey] <= 1) {
            delete updated[cartKey];
        } else if (updated[cartKey]) {
            updated[cartKey] -= 1;
        }
        return updated
    })
    if(token){
        try{
            await axios.post(`${url}/api/cart/remove`, {id: productId, size: itemSize, removeAll: removeAll} , {headers:{token}})
        }catch(err){
            console.log(err)
        }
    }
}

const clearCart = async ()=>{
    setCartItems({})
    if(token){
        try{
            await axios.post(`${url}/api/cart/clear`, {}, {headers:{token}})
        }catch(err){
            console.log(err)
        }
    }
}

const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [cartKey, qty]) => {
        const [productId] = cartKey.split('_');
        const product = products.find((p) => p._id === String(productId)) 
                      || all_mockups.find((m) => m._id === String(productId))
                      || customMockups.find((cm) => cm._id === String(productId));
        return total + (product ? product.price * qty : 0);
    }, 0);
}

const placeOrder = async (orderData) => {
    const orderItems = [];
    Object.entries(cartItems).forEach(([cartKey, qty]) => {
        if (qty > 0) {
            const [productId, size] = cartKey.split('_');
            const isCustomMockup = customMockups.some((cm) => cm._id === String(productId));
            const product = products.find((p) => p._id === String(productId)) 
                          || all_mockups.find((m) => m._id === String(productId))
                          || customMockups.find((cm) => cm._id === String(productId));
            if (product) {
                let itemInfo = { 
                    ...product, 
                    image: product.image || product.imageFront, 
                    size: size || 'M', 
                    quantity: qty 
                };
                if (isCustomMockup) {
                    itemInfo.isCustomMockup = true;
                    itemInfo.imageFront = product.imageFront;
                    itemInfo.imageBack = product.imageBack;
                    itemInfo.uploadedImages = product.uploadedImages || [];
                }
                orderItems.push(itemInfo);
            }
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

const fetchMockups = async () => {
    try {
        const res = await axios.get(`${url}/api/mockup/list`);
        if (res.data.success) {
            setAllMockups(res.data.data);
        } else {
            console.error("Failed to fetch mockups");
        }
    } catch (err) {
        console.error("Error fetching mockups:", err);
    }
};

const fetchCustomMockups = async (tokenValue) => {
    const activeToken = tokenValue || token;
    if (!activeToken) return;
    try {
        const res = await axios.get(`${url}/api/mockup/custom/list`, { headers: { token: activeToken } });
        if (res.data.success) {
            setCustomMockups(res.data.data || []);
        }
    } catch (err) {
        console.error("Error fetching custom mockups:", err);
    }
};


const loadCartData = async(token)=> {

    const res = await axios.get(`${url}/api/cart/get`, {headers:{token}})
    setCartItems(res.data.cartData)
}


useEffect(()=>{

    async function loadData() {
        setLoading(true);
        await Promise.all([
            fetchProductsList(),
            fetchMockups()
        ]);
        if(localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
        } else {
            setLoading(false);
        }
    }
    loadData()
}, [])


const value ={
    cartItems,
    all_products:products, 
    all_mockups,
    customMockups,
    fetchCustomMockups,
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
