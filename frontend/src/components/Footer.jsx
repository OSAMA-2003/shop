import React, { useState } from 'react'
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${formData.name}, Thank you for contacting us!`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className='relative w-full min-h-screen bg-surface text-text-main py-32 px-6 sm:px-10 border-t border-border-light'>

      <div className='relative z-10 max-w-7xl mx-auto'>
        <h2 className='text-4xl sm:text-5xl font-extrabold mb-6 text-center'>
          Contact us<span className="text-primary">.</span>
        </h2>

        <p className='text-text-muted mb-16 text-center text-lg sm:text-xl max-w-2xl mx-auto'>
          We are here to help you at any time. Send us a message and we will get back to you soon!
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          <div className='space-y-8'>
            <div className='flex items-center gap-4 bg-background border border-border-light p-6 
            rounded-3xl shadow-sm hover:shadow-soft transition-all'>
              <MapPin className='w-8 h-8 text-primary' />
              <div>
                <h4 className='font-semibold text-lg'>Address</h4>
                <p className='text-text-muted'>Imagination Street, Future City 123</p>
              </div>
            </div>

            <div className='flex items-center gap-4 bg-background border border-border-light p-6 
            rounded-3xl shadow-sm hover:shadow-soft transition-all'>
              <Phone className='w-8 h-8 text-primary' />
              <div>
                <h4 className='font-semibold text-lg'>Phone</h4>
                <p className='text-text-muted'>+123 456 7890</p>
              </div>
            </div>

            <div className='flex items-center gap-4 bg-background border border-border-light p-6 
            rounded-3xl shadow-sm hover:shadow-soft transition-all'>
              <Mail className='w-8 h-8 text-primary' />
              <div>
                <h4 className='font-semibold text-lg'>Email</h4>
                <p className='text-text-muted'>support@ecommerce.com</p>
                        </div>
                         </div>
                          </div>
      

        <form onSubmit={handleSubmit} className='bg-background border border-border-light p-10 
        rounded-3xl shadow-soft flex flex-col gap-6'>
          <input
            type='text'
            name="name"
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
            required
            className='bg-surface p-4 rounded-xl text-text-main placeholder-text-muted border border-border-light
            font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all
             resize-none'
          />

          <input
            type='email'
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
            className='bg-surface p-4 rounded-xl text-text-main placeholder-text-muted border border-border-light
            font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all
             resize-none'
          />

          <textarea
            name='message'
            placeholder='Message'
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className='bg-surface p-4 rounded-xl text-text-main placeholder-text-muted border border-border-light
            font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all
             resize-none'
          ></textarea>

          <button
            type='submit'
            className='bg-primary px-8 py-4 rounded-xl font-bold text-white hover:bg-[#d94f15] transition-all shadow-soft'>
            Send Message
          </button>
        </form>

        <footer className='mt-24 relative z-10 max-w-7xl mx-auto text-center text-text-muted border-t border-border-light pt-8'>
          <p className='mb-4'>© 2025 E-Commerce. All rights reserved</p>
          <div className='flex justify-center gap-6'>
            <a href="#" className='hover:text-primary transition-colors'>Facebook</a>
            <a href="#" className='hover:text-primary transition-colors'>Twitter</a>
            <a href="#" className='hover:text-primary transition-colors'>Instagram</a>
            <a href="#" className='hover:text-primary transition-colors'>LinkedIn</a>
          </div>
        </footer>
      </div>
        </div>
    </section>
  );
}

export default Footer;