
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from 'axios'
import { ShopContext } from "../context/ShopContenxt";



const SignUp = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const { url , setToken} = useContext(ShopContext)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

   const onChangeHandler = (e) => {
  const name = e.target.name;
  const value = e.target.value;

    setFormData((data)=>({
      ...data, [name] : value
    }))
  }


  const onSignUp = async (e) => {
     e.preventDefault();

     if(formData.password !== formData.confirmPassword){
      alert ("Password do not match")
      return
     }
 
     try {
       const res = await axios.post(
         url +"/api/user/signup",
         formData
       );
 
       if (res.data.success) {
         localStorage.setItem("token", res.data.token);
         setToken(res.data.token);
         navigate("/");
       } else {
         alert(res.data.message);
       }
     } catch (err) {
       console.log(err);
       alert(err.message);
     }
   };
 



  return (
    <section className='relative w-full min-h-screen bg-linear-to-r from-indigo-900
    via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10 flex
    items-center justify-center'>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm p-10 pointer-events-none'>
      </div>
      <div className='relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-10 rounded-3xl
shadow-2xl'>

        <h2 className='text-3xl sm:text-4xl font-extrabold mb-6 text-center'>Create a new account </h2>
        <form onSubmit={onSignUp} className='flex flex-col gap-6'>
          <input type='text'
            name='name'
            placeholder='Full name'
            value={formData.name}
            onChange={onChangeHandler}
            required
            className='w-full bg-white/15 text-white placeholder-gray-300 px-4 py-3 rounded-xl 
  outline-none focus:ring-2 focus:ring-cyan-400 '/>

          <input type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={onChangeHandler}
            required
            className='w-full bg-white/15 text-white placeholder-gray-300 px-4 py-3 rounded-xl 
  outline-none focus:ring-2 focus:ring-cyan-400 '/>

          <input type='password'
            name='password'
            placeholder='Password'
            autoComplete="new-password"
            value={formData.password}
            onChange={onChangeHandler}
            required

            className='w-full bg-white/15 text-white placeholder-gray-300 px-4 py-3 rounded-xl 
  outline-none focus:ring-2 focus:ring-cyan-400 '/>

          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            value={formData.confirmPassword}
            onChange={onChangeHandler}
            required
            className='w-full bg-white/15 text-white placeholder-gray-300 px-4 py-3 rounded-xl 
  outline-none focus:ring-2 focus:ring-cyan-400 '

          />


          <button type='submit' className='bg-linear-to-r from-cyan-400 to-blue-500 px-6
     py-3 rounded-2xl font-semibold text-white hover:opacity-90 transition-all shadow-lg'>
            Create an account
          </button>
        </form>
        <p className='mt-6 text-center text-gray-300'>
          Do you have an account? {""}
          <span
            onClick={() => navigate("/login")}
            className='text-cyan-400 font-semibold cursor-pointer hover:underline'>
            Log in
          </span>
        </p>
      </div>
    </section>
  )
}

export default SignUp;