import React, { useState } from 'react';
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
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
    <section id='contact' className='w-full min-h-screen bg-[#f9f9f6] text-black py-24 px-6 sm:px-10 font-sans border-b-[4px] border-black'>
      <div className='max-w-7xl mx-auto'>
        
        {/* HEADING */}
        <div className='mb-16'>
          <h2 className='text-6xl sm:text-7xl font-black uppercase tracking-tighter mb-4 leading-none'>
            Contact <span className="text-[#ff5500]">Us</span>
          </h2>
          <p className='font-mono text-lg font-bold text-black/70 max-w-2xl'>
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          
          {/* LEFT: INFO CARDS */}
          <div className='space-y-6'>
            {/* Address Card */}
            <div className='flex items-center gap-6 bg-white border-[4px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'>
              <div className='w-16 h-16 shrink-0 bg-[#e5e5e5] border-[3px] border-black flex items-center justify-center'>
                <MapPin className='w-8 h-8 text-black' strokeWidth={2.5} />
              </div>
              <div>
                <h4 className='font-black uppercase tracking-widest text-xl mb-1'>Address</h4>
                <p className='font-mono font-bold text-sm text-black/70'>Imagination Street, Future City 123</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className='flex items-center gap-6 bg-white border-[4px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'>
              <div className='w-16 h-16 shrink-0 bg-[#ff5500] border-[3px] border-black flex items-center justify-center'>
                <Phone className='w-8 h-8 text-black' strokeWidth={2.5} />
              </div>
              <div>
                <h4 className='font-black uppercase tracking-widest text-xl mb-1'>Phone</h4>
                <p className='font-mono font-bold text-sm text-black/70'>+123 456 7890</p>
              </div>
            </div>

            {/* Email Card */}
            <div className='flex items-center gap-6 bg-white border-[4px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'>
              <div className='w-16 h-16 shrink-0 bg-[#e5e5e5] border-[3px] border-black flex items-center justify-center'>
                <Mail className='w-8 h-8 text-black' strokeWidth={2.5} />
              </div>
              <div>
                <h4 className='font-black uppercase tracking-widest text-xl mb-1'>Email</h4>
                <p className='font-mono font-bold text-sm text-black/70'>support@ecommerce.com</p>
              </div>
            </div>
            {/* Email Card */}
            <div className='flex items-center gap-6 bg-white border-[4px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'>
              <div className='w-16 h-16 shrink-0 bg-[#e5e5e5] border-[3px] border-black flex items-center justify-center'>
                <Phone className='w-8 h-8 text-black' strokeWidth={2.5} />
              </div>
              <div>
                <h4 className='font-black uppercase tracking-widest text-xl mb-1'>Whatsapp</h4>
                <p className='font-mono font-bold text-sm text-black/70'>0102931414</p>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <form 
            onSubmit={handleSubmit} 
            className='bg-white border-[4px] border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6'
          >
            <div className='flex flex-col'>
              <label className='text-sm font-black uppercase tracking-widest mb-2'>Name *</label>
              <input
                type='text'
                name="name"
                placeholder='ENTER YOUR NAME'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full border-[3px] border-black p-4 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors'
              />
            </div>

            <div className='flex flex-col'>
              <label className='text-sm font-black uppercase tracking-widest mb-2'>Email *</label>
              <input
                type='email'
                name="email"
                placeholder='YOU@EXAMPLE.COM'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full border-[3px] border-black p-4 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors'
              />
            </div>

            <div className='flex flex-col'>
              <label className='text-sm font-black uppercase tracking-widest mb-2'>Message *</label>
              <textarea
                name='message'
                placeholder='HOW CAN WE HELP?'
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className='w-full border-[3px] border-black p-4 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors resize-none'
              ></textarea>
            </div>

            <button
              type='submit'
              className='w-full bg-[#ff5500] border-[3px] border-black py-4 mt-2 font-black text-2xl uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
            >
              Send Message
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}

export default Contact;